import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Req, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FastifyReply, FastifyRequest } from 'fastify'
import ms from 'ms'
import { CurrentUser } from '~/common/decorators/current-user.decorator'
import { Public } from '~/common/decorators/public.decorator'
import { IAuthUser } from '~/common/type'
import { ISecurityConfig, SecurityConfig } from '~/config'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RefreshAccessDto } from './dto/refresh-access.dto'

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  private readonly cookiePath = '/api/auth'
  private readonly cookieName: string
  private readonly refreshTime: number

  constructor(
    private readonly authService: AuthService,
    @Inject(SecurityConfig.KEY) private readonly securityConfig: ISecurityConfig
  ) {
    this.cookieName = securityConfig.cookieRefresh
    this.refreshTime = ms(securityConfig.refreshExpireIn)
  }

  // Add login method here
  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({
      passthrough: true
    })
    res: FastifyReply,
    @Body() body: LoginDto
  ) {
    const result = await this.authService.login(body)
    this.saveRefreshCookie(res, result.refreshToken)
    return result
  }

  @Post('refresh-access')
  @Public()
  @HttpCode(HttpStatus.OK)
  async refreshAccess(@Res({ passthrough: true }) res: FastifyReply, @Body() body: RefreshAccessDto) {
    const result = await this.authService.refreshAccess(body.refreshToken)
    return this.saveRefreshCookie(res, result.refreshToken).send(result)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: FastifyRequest, @Res({ passthrough: true }) res: FastifyReply) {
    await this.authService.logout(req.user, req.accessToken)

    res.clearCookie(this.cookieName, { path: this.cookiePath })
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async me(@CurrentUser() user: IAuthUser) {
    return this.authService.getMe(user.id)
  }

  private saveRefreshCookie(res: FastifyReply, refreshToken: string): FastifyReply {
    return res
      .cookie(this.cookieName, refreshToken, {
        secure: true,
        httpOnly: true,
        signed: true,
        path: this.cookiePath,
        expires: new Date(Date.now() + this.refreshTime)
      })
      .header('Content-Type', 'application/json')
  }
}
