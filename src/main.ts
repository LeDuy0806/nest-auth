import { BadRequestException, HttpStatus, Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions-filter'
import { ConfigKeyPaths } from './config'
import setupSwagger from './setup-swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService<ConfigKeyPaths>)

  const logger = new Logger('Main')

  app.useGlobalFilters(new AllExceptionsFilter()) // Enable global filters

  // Enable validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Strip properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      stopAtFirstError: true,
      exceptionFactory: (validationErrors) => {
        return new BadRequestException(validationErrors[0].constraints[Object.keys(validationErrors[0].constraints)[0]])
      }
    })
  )

  // Set global prefix for all routes
  const globalPrefix = configService.get('app.globalPrefix')
  app.setGlobalPrefix(globalPrefix)

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true
  })

  //config swagger
  const swaggerPath = configService.get('swagger.path')
  setupSwagger(app, configService)

  // Start listening to port
  const port = configService.get('app.port')
  await app.listen(port, () => {
    logger.log(`Listening to port ${port}`)
  })

  // Log current url of app and documentation
  let baseUrl = app.getHttpServer().address().address
  if (baseUrl === '0.0.0.0' || baseUrl === '::') {
    baseUrl = 'localhost'
  }
  const url = `http://${baseUrl}:${port}${globalPrefix}`

  logger.log(`Listening to ${url}`)

  if (configService.get('app.isDev')) {
    logger.log(`API Documentation available at ${url.replace('api', swaggerPath)}/`)
  }
}
bootstrap()
