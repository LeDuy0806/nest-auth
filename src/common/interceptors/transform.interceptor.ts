import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import { parse } from 'qs'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { SuccessResponse } from '../models/response.model'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const http = context.switchToHttp()
    const request = http.getRequest<FastifyRequest>()

    //Process query parameters and convert array parameters into arrays, such as: ?a[]=1&a[]=2 => { a: [1, 2] }
    request.query = parse(request.url.split('?')[1])

    return next.handle().pipe(
      map((data) => {
        return new SuccessResponse(data)
      })
    )
  }
}
