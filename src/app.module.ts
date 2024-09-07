import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import config from '~/config'
import { UserModule } from '~/modules/user/user.module'
import { DatabaseModule } from '~/shared/database/database.module'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { AuthModule } from './modules/auth/auth.module'
import { JWTAuthGuard } from './modules/auth/guards/jwt-auth.guard'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: ['.env.local', '.env', `.env.${process.env.NODE_ENV}`],
      load: [...Object.values(config)]
    }),
    DatabaseModule,
    AuthModule,
    UserModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JWTAuthGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    }
  ]
})
export class AppModule {
  static isDev: boolean

  constructor(private readonly configService: ConfigService) {
    AppModule.isDev = this.configService.get('NODE_ENV') === 'development'
  }
}
