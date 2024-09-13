import { registerAs } from '@nestjs/config'
import { envNumber, envString } from '~/global/env'

export const redisRegToken = 'redis'

export const RedisConfig = registerAs(redisRegToken, () => ({
  host: envString('REDIS_HOST', '127.0.0.1'),
  port: envNumber('REDIS_PORT', 6379),
  password: envString('REDIS_PASSWORD')
}))

export type IRedisConfig = ReturnType<typeof RedisConfig>
