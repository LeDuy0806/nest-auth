import { FastifyRequest as Request } from 'fastify'
import { IAuthUser } from '~/common/type'

declare module 'fastify' {
  interface FastifyRequest extends Request {
    user?: IAuthUser
    accessToken?: string
  }
}
