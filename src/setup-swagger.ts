import { INestApplication, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { API_SECURITY_AUTH } from './common/decorators/swagger.decorator'
import { CommonEntity } from './common/entity/common.entity'
import { SuccessResponse } from './common/models/response.model'
import { ConfigKeyPaths, ISwaggerConfig, swaggerRegToken } from './config'

export default function setupSwagger(app: INestApplication, configService: ConfigService<ConfigKeyPaths>) {
  const { enable, path, description } = configService.get<ISwaggerConfig>(swaggerRegToken)

  if (!enable) {
    Logger.log('Swagger is disabled', 'setupSwagger')
    return
  }

  const documentBuilder = new DocumentBuilder()
    .setTitle('NestJS - APIs Document')
    .setDescription(description)
    .setVersion('1.0')

  documentBuilder.addSecurity(API_SECURITY_AUTH, {
    description: 'JWT Token (Bearer)',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
  })

  const document = SwaggerModule.createDocument(app, documentBuilder.build(), {
    ignoreGlobalPrefix: true,
    extraModels: [CommonEntity, SuccessResponse]
  })

  SwaggerModule.setup(path, app, document, {
    swaggerOptions: {
      persistAuthorization: true
    }
  })
}
