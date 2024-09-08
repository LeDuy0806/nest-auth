import fastifyCookie, { FastifyCookieOptions } from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyCsrfProtection from '@fastify/csrf-protection'
import fastifyHelmet from '@fastify/helmet'
import { BadRequestException, HttpStatus, Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions-filter'
import { ConfigKeyPaths } from './config'
import setupSwagger from './setup-swagger'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
  const configService = app.get(ConfigService<ConfigKeyPaths>)

  // Register fastify-cookie plugin to enable cookie parsing
  await app.register<FastifyCookieOptions>(fastifyCookie, {
    secret: configService.get('security.cookieSecret', { infer: true })
  })
  // Register fastify-helmet plugin to secure the app by setting various HTTP headers
  await app.register(fastifyHelmet)
  // Register fastify-csrf-protection plugin to enable CSRF protection
  // Explanation: this plugin will set a cookie with a CSRF token and will check the token in the request header,
  await app.register(fastifyCsrfProtection, {
    cookieOpts: { signed: true }
  })
  // Register fastify-cors plugin to enable CORS
  await app.register(fastifyCors, {
    credentials: true,
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false
  })

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
  const { port, globalPrefix } = configService.get('app', { infer: true })
  app.setGlobalPrefix(globalPrefix)

  //config swagger
  const { path: swaggerPath } = configService.get('swagger', { infer: true })
  setupSwagger(app, configService)

  // Start listening to port
  await app.listen(port, () => {
    logger.log(`Listening to port ${port}`)
  })

  // Log current url of app and documentation
  let baseUrl = app.getHttpServer().address()

  if (typeof baseUrl == 'object' && (baseUrl.address === '0.0.0.0' || baseUrl.address.includes('::'))) {
    baseUrl = 'localhost'
  }
  const url = `http://${baseUrl}:${port}${globalPrefix}`

  logger.log(`Listening to ${url}`)

  if (configService.get('app.isDev')) {
    logger.log(`API Documentation available at ${url.replace('api', swaggerPath)}/`)
  }
}
bootstrap()
