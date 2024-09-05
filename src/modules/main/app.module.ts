import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from 'joi'
import { UserModule } from '../user/user.module'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        PORT: Joi.number().default(8080),
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        DATABASE_HOST: Joi.string().hostname().required(),
        DATABASE_PORT: Joi.number().port().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required()
      })
    }),
    DatabaseModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  static port: string | number
  static isDev: boolean

  constructor(private readonly configService: ConfigService) {
    AppModule.port = this.configService.get('PORT')
    AppModule.isDev = this.configService.get('NODE_ENV') === 'development'
  }
}
