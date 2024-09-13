import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { QueryFailedError } from 'typeorm'
import { ErrorMessageEnum } from '~/constants'

interface ErrorResponse {
  readonly success: boolean
  readonly statusCode: number
  readonly message: string
}
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()

    const status = this.getStatus(exception)
    const message = this.getErrorMessage(exception)
    const stack = (exception as any)?.stack

    this.logger.error(
      `${status}(${exception.constructor.name}) - Error message "${message}" at endpoint: ${request.url}`
    )

    response.status(status).send({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
      stack
    } as ErrorResponse)
  }

  getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus()
    } else if (exception instanceof QueryFailedError) {
      return HttpStatus.INTERNAL_SERVER_ERROR
    } else {
      return (exception as ErrorResponse)?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR
    }
  }

  getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      return exception.message
    } else if (exception instanceof QueryFailedError) {
      if (exception.driverError?.code === '23505') {
        return ErrorMessageEnum.DUPLICATED_VALUE
      }
      return exception.message
    } else {
      return (exception as any)?.response?.message ?? (exception as ErrorResponse)?.message ?? `${exception}`
    }
  }
}
