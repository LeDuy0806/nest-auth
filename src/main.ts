import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/main/app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  const logger = new Logger('Main')

  // Enable validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Strip properties that are not in the DTO
      forbidNonWhitelisted: true // Throw an error if non-whitelisted properties are present
    })
  )

  // Set global prefix for all routes
  const globalPrefix = configService.get('GLOBAL_PREFIX')
  app.setGlobalPrefix(globalPrefix)

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true
  })

  //config swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS - APIs Document')
    .setDescription('All Modules APIs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header'
      },
      'token'
    )
    .addSecurityRequirements('token')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true
    }
  })

  // Start listening to port
  const port = configService.get('PORT')
  await app.listen(port, () => {
    logger.log(`Listening to port ${port}`)
  })

  // Log current url of app and documentation
  let baseUrl = app.getHttpServer().address().address
  if (baseUrl === '0.0.0.0' || baseUrl === '::') {
    baseUrl = 'localhost'
  }
  const url = `http://${baseUrl}:${AppModule.port}${globalPrefix}`
  logger.log(`Listening to ${url}`)
  if (AppModule.isDev) {
    logger.log(`API Documentation available at ${url}/swagger`)
  }
}
bootstrap()
