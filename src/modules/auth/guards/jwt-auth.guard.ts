import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { AuthStrategy, PUBLIC_KEY } from '~/constants'

@Injectable()
export class JWTAuthGuard extends AuthGuard(AuthStrategy.JWT) {
  constructor(private readonly reflector: Reflector) {
    super()
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [context.getHandler(), context.getClass()])

    if (isPublic) {
      return true
    }
    return super.canActivate(context)
  }
}
