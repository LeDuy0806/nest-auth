import { registerAs } from '@nestjs/config'
import * as dotenv from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'
import { env, envBoolean, envNumber } from '~/global/env'

dotenv.config({
  path: '.env'
})

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: env('DATABASE_HOST', 'localhost'),
  port: envNumber('DATABASE_PORT', 5432),
  username: env('DATABASE_USERNAME', 'postgres'),
  password: env('DATABASE_PASSWORD', '123'),
  database: env('DATABASE_NAME', 'nest_db'),
  synchronize: envBoolean('DATABASE_SYNCHRONIZE', true),
  entities: ['dist/modules/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  subscribers: ['dist/modules/**/*.subscriber{.ts,.js}']
}

export const dbRegToken = 'database'

export const DatabaseConfig = registerAs(dbRegToken, (): DataSourceOptions => dataSourceOptions)

export type IDatabaseConfig = ReturnType<typeof DatabaseConfig>

const dataSource = new DataSource(dataSourceOptions)

export default dataSource
