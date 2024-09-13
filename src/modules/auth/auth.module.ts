import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtTokenService } from './services/jwt-token.service'
import { JwtStrategy } from './strategies/jwt.strategy'

const services = [AuthService, JwtTokenService, JwtService]
const strategies = [JwtStrategy]

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [...services, ...strategies]
})
export class AuthModule {}
