import { registerAs } from '@nestjs/config'
import { envBoolean, envNumber, envString } from '~/global/env'

export const appRegToken = 'app'

export const AppConfig = registerAs(appRegToken, () => ({
  name: envString('APP_NAME', 'NestJS API'),
  isDev: envString('NODE_ENV', 'development') === 'development',
  port: envNumber('PORT', 3000),
  globalPrefix: envString('GLOBAL_PREFIX', '/api'),
  cors: envBoolean('CORS', true)
}))

export type IAppConfig = ReturnType<typeof AppConfig>
