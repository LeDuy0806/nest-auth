import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { Cache } from 'cache-manager'
import { FastifyRequest } from 'fastify'
import { isEmpty } from 'lodash'
import { ExtractJwt } from 'passport-jwt'
import { AuthStrategy, ErrorMessageEnum, PUBLIC_KEY } from '~/constants'
import { genTokenBlacklistKey } from '~/helper/genRedisKey'

@Injectable()
export class JWTAuthGuard extends AuthGuard(AuthStrategy.JWT) {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly reflector: Reflector
  ) {
    super()
  }
  async canActivate(context: ExecutionContext): Promise<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [context.getHandler(), context.getClass()])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest<FastifyRequest>()

    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request)

    if (!accessToken) {
      throw new ForbiddenException(ErrorMessageEnum.NOT_ACCESSIBLE)
    }

    if (await this.cacheManager.get(genTokenBlacklistKey(accessToken)))
      throw new ForbiddenException(ErrorMessageEnum.NOT_ACCESSIBLE)

    request.accessToken = accessToken

    return super.canActivate(context)
  }

  // handle request error then throw error with token expired message or invalid token message
  handleRequest(err, user, info) {
    if (!isEmpty(user)) return user

    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException(ErrorMessageEnum.TOKEN_EXPIRED)
    } else if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException(ErrorMessageEnum.INVALID_TOKEN)
    }

    throw new UnauthorizedException()
  }
}
