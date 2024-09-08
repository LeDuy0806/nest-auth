import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { IAuthUser } from '~/common/type'
import { ISecurityConfig, SecurityConfig } from '~/config'
import { AuthStrategy } from '~/constants'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthStrategy.JWT) {
  constructor(@Inject(SecurityConfig.KEY) private readonly securityConfig: ISecurityConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: securityConfig.jwtSecret
    })
  }
  validate(payload: IAuthUser) {
    return payload
  }
}
