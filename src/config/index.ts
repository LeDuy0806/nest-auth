import { RecordNamePaths } from '~/utils'
import { AppConfig, appRegToken, IAppConfig } from './app.config'
import { DatabaseConfig, dbRegToken, IDatabaseConfig } from './database.config'
import { IRedisConfig, RedisConfig, redisRegToken } from './redis.config'
import { ISecurityConfig, SecurityConfig, securityRegToken } from './security.config'
import { ISwaggerConfig, SwaggerConfig, swaggerRegToken } from './swagger.config'

export * from './app.config'
export * from './database.config'
export * from './redis.config'
export * from './security.config'
export * from './swagger.config'

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
