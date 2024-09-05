import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    // const request = ctx.getRequest()

    const status = exception.getStatus()
    const message = exception.message

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      message
    })
  }
}
