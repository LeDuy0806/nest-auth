import { ConfigType, registerAs } from '@nestjs/config'

import { env, envNumber } from '~/global/env'

export const securityRegToken = 'security'

export const SecurityConfig = registerAs(securityRegToken, () => ({
  jwtSecret: env('ACCESS_TOKEN_SECRET'),
  jwtExpired: envNumber('ACCESS_TOKEN_EXPIRED_IN'),
  refreshSecret: env('REFRESH_TOKEN_SECRET'),
  refreshExpire: envNumber('REFRESH_TOKEN_EXPIRED_IN'),
  cookieSecret: env('COOKIE_SECRET')
}))

export type ISecurityConfig = ConfigType<typeof SecurityConfig>
