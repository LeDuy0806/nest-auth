import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import { Cache } from 'cache-manager'
import ms from 'ms'
import { v4 } from 'uuid'
import { IAuthUser } from '~/common/type'
import { ISecurityConfig, SecurityConfig } from '~/config'
import { ErrorMessageEnum } from '~/constants'
import { AccessTokenEntity } from '../entities/access-token.entity'
import { RefreshTokenEntity } from '../entities/refresh-token.entity'
import { TokenTypeEnum } from '../enums/token-type.enum'
import { IAccessPayload } from '../interfaces/access-token.interface'
import { IRefreshPayload } from '../interfaces/refresh-token.interface'

@Injectable()
export class JwtTokenService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(SecurityConfig.KEY) private readonly securityConfig: ISecurityConfig,
    private readonly jwtService: JwtService
  ) {}

  async refreshToken(refreshToken: string) {
    await this.verifyToken(refreshToken, TokenTypeEnum.REFRESH)

    const foundRefreshToken = await RefreshTokenEntity.findOne({
      where: {
        value: refreshToken
      },
      relations: ['accessToken']
    })

    if (!foundRefreshToken) throw new UnauthorizedException(ErrorMessageEnum.INVALID_TOKEN)

    console.log(foundRefreshToken)

    const accessToken = await AccessTokenEntity.findOne({
      where: {
        refreshToken: {
          value: refreshToken
        }
      },
      relations: ['user', 'refreshToken']
    })

    if (!accessToken) throw new BadRequestException(ErrorMessageEnum.INVALID_TOKEN)

    const token = await this.generateAuthToken({ id: accessToken.user.id })

    await RefreshTokenEntity.delete(foundRefreshToken.id)
    await AccessTokenEntity.delete(accessToken.id)

    return token
  }

  async generateAuthToken({ id: uid }: IAuthUser) {
    const payload: IAccessPayload = {
      id: uid
    }

    const token = await this.jwtService.signAsync(payload, {
      secret: this.securityConfig.accessSecret,
      expiresIn: this.securityConfig.accessExpireIn
    })

    const accessTokenEntity = await AccessTokenEntity.save({
      value: token,
      expired_at: new Date(Date.now() + ms(this.securityConfig.accessExpireIn)),
      user: { id: uid }
    })

    const { refreshTokenSign, refreshToken } = await this.generateRefreshToken(accessTokenEntity)

    accessTokenEntity.refreshToken = refreshToken

    await AccessTokenEntity.save(accessTokenEntity)

    return {
      accessToken: token,
      refreshToken: refreshTokenSign
    }
  }

  async generateRefreshToken(accessToken: AccessTokenEntity) {
    const payload: IRefreshPayload = {
      tokenId: v4()
    }

    const token = await this.jwtService.signAsync(payload, {
      secret: this.securityConfig.refreshSecret,
      expiresIn: this.securityConfig.refreshExpireIn
    })

    const refreshToken = RefreshTokenEntity.create({
      value: token,
      expired_at: new Date(Date.now() + ms(this.securityConfig.refreshExpireIn)),
      accessToken
    })

    await refreshToken.save()

    return {
      refreshTokenSign: token,
      refreshToken: refreshToken
    }
  }

  async verifyToken(token: string, type: TokenTypeEnum) {
    try {
      switch (type) {
        case TokenTypeEnum.ACCESS:
          return this.jwtService.verifyAsync(token, {
            secret: this.securityConfig.accessSecret
          })
        case TokenTypeEnum.REFRESH:
          return this.jwtService.verifyAsync(token, {
            secret: this.securityConfig.refreshSecret
          })
        default:
          throw new BadRequestException(ErrorMessageEnum.INVALID_TOKEN)
      }
    } catch (error: unknown) {
      if (error instanceof TokenExpiredError) throw new BadRequestException(ErrorMessageEnum.TOKEN_EXPIRED)
      else throw new BadRequestException(ErrorMessageEnum.INVALID_TOKEN)
    }
  }

  async removeAccessToken(accessToken: string) {
    const token = await AccessTokenEntity.findOne({
      where: {
        value: accessToken
      }
    })

    AccessTokenEntity.delete(token.id)
  }

  async getAccessByRefresh(refreshToken: string) {
    const accessToken = await AccessTokenEntity.findOne({
      where: {
        refreshToken: {
          value: refreshToken
        }
      }
    })

    if (!accessToken) throw new BadRequestException(ErrorMessageEnum.INVALID_TOKEN)

    return accessToken
  }
}
