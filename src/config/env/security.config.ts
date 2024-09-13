import { ConfigType, registerAs } from '@nestjs/config'

import { env } from '~/global/env'

export const securityRegToken = 'security'

export const SecurityConfig = registerAs(securityRegToken, () => ({
  accessSecret: env('ACCESS_TOKEN_SECRET'),
  accessExpireIn: env('ACCESS_TOKEN_EXPIRED_IN'),
  refreshSecret: env('REFRESH_TOKEN_SECRET'),
  refreshExpireIn: env('REFRESH_TOKEN_EXPIRED_IN'),
  cookieRefresh: env('COOKIE_REFRESH', 'refresh_token'),
  cookieSecret: env('COOKIE_SECRET')
}))

export type ISecurityConfig = ConfigType<typeof SecurityConfig>
