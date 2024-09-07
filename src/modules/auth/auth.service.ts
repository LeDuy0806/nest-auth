import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { isEmpty } from 'lodash'
import { IAuthUser } from '~/common/type'
import { ErrorMessageEnum } from '~/constants/error-message.constant'
import { verifyPassword } from '~/utils/password.util'
import { UserService } from '../user/user.service'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    @Inject()
    private readonly userService: UserService,

    private readonly jwtService: JwtService
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
    const foundUser = await this.userService.findUserByEmailOrUsername(credential)

    if (isEmpty(foundUser)) {
      throw new BadRequestException(ErrorMessageEnum.USER_NOT_FOUND)
    }

    const userCredential = await this.userService.findCredentialByUserId(foundUser.id)

    const isPasswordMatch = await verifyPassword(password, userCredential.password)

    if (!isPasswordMatch) {
      throw new BadRequestException(ErrorMessageEnum.INVALID_CREDENTIALS)
    }
    const payload: IAuthUser = {
      id: foundUser.id
    }

    return {
      accessToken: this.jwtService.sign(payload)
    }
  }

  async getMe(userId: string) {
    const user = await this.userService.findOne('id', userId)

    if (isEmpty(user)) {
      throw new BadRequestException(ErrorMessageEnum.USER_NOT_FOUND)
    }

    return user
  }
}
