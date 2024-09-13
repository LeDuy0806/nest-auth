import { RecordNamePaths } from '~/utils'
import { AppConfig, appRegToken, IAppConfig } from './env/app.config'
import { DatabaseConfig, dbRegToken, IDatabaseConfig } from './env/database.config'
import { IRedisConfig, RedisConfig, redisRegToken } from './env/redis.config'
import { ISecurityConfig, SecurityConfig, securityRegToken } from './env/security.config'
import { ISwaggerConfig, SwaggerConfig, swaggerRegToken } from './env/swagger.config'

export * from './env/app.config'
export * from './env/database.config'
export * from './env/redis.config'
export * from './env/security.config'
export * from './env/swagger.config'

export interface AllConfigType {
  [appRegToken]: IAppConfig
  [dbRegToken]: IDatabaseConfig
  [securityRegToken]: ISecurityConfig
  [swaggerRegToken]: ISwaggerConfig
  [redisRegToken]: IRedisConfig
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>

export default {
  AppConfig,
  DatabaseConfig,
  SecurityConfig,
  SwaggerConfig,
  RedisConfig
}
