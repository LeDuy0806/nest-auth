import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { isEmpty } from 'lodash'
import ms from 'ms'
import { IAuthUser } from '~/common/type'
import { ISecurityConfig, SecurityConfig } from '~/config'
import { ErrorMessageEnum } from '~/constants/error-message.constant'
import { genTokenBlacklistKey } from '~/helper/genRedisKey'
import { verifyPassword } from '~/utils/password.util'
import { UserService } from '../user/user.service'
import { LoginDto } from './dto/login.dto'
import { JwtTokenService } from './services/jwt-token.service'

@Injectable()
export class AuthService {
  constructor(
    @Inject()
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(SecurityConfig.KEY) private readonly securityConfig: ISecurityConfig,
    private readonly jwtService: JwtTokenService
  ) {}

  async validateUser(credential: string, password: string) {
    const user = await this.userService.findUserByEmailOrUsername(credential)

    if (isEmpty(user)) {
      throw new BadRequestException(ErrorMessageEnum.USER_NOT_FOUND)
    }

    const userCredential = await this.userService.findCredentialByUserId(user.id)

    const isPasswordMatch = await verifyPassword(password, userCredential.password)

    if (!isPasswordMatch) {
      throw new BadRequestException(ErrorMessageEnum.INVALID_CREDENTIALS)
    }

    return user
  }

  async login({ credential, password }: LoginDto) {
    const foundUser = await this.validateUser(credential, password)

    const payload: IAuthUser = {
      id: foundUser.id
    }

    const token = await this.jwtService.generateAuthToken(payload)

    return {
      user: foundUser,
      ...token
    }
  }

  async refreshAccess(refreshToken: string) {
    return this.jwtService.refreshToken(refreshToken)
  }

  async logout(user: IAuthUser, accessToken: string) {
    const exp = user.exp ? user.exp * 1000 - Date.now() : ms(this.securityConfig.accessExpireIn)

    await this.cacheManager.set(genTokenBlacklistKey(accessToken), accessToken, exp)

    await this.jwtService.removeAccessToken(accessToken)
  }

  async getMe(userId: string) {
    const user = await this.userService.findOne('id', userId)

    if (isEmpty(user)) {
      throw new BadRequestException(ErrorMessageEnum.USER_NOT_FOUND)
    }

    return user
  }
}
