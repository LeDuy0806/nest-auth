import { registerAs } from '@nestjs/config'
import { envBoolean, envString } from '~/global/env'

export const swaggerRegToken = 'swagger'

export const SwaggerConfig = registerAs(swaggerRegToken, () => ({
  enable: envBoolean('SWAGGER_ENABLE', true),
  path: envString('SWAGGER_PATH', 'api-docs'),
  description: envString('SWAGGER_DESCRIPTION', 'API description')
}))

export type ISwaggerConfig = ReturnType<typeof SwaggerConfig>
