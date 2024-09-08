import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { ConfigKeyPaths, dbRegToken, IDatabaseConfig } from '~/config'
import { DatabaseService } from './database.service'
import { TypeORMLogger } from './typeorm-logger'

@Module({
  providers: [DatabaseService],
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        return {
          ...configService.get<IDatabaseConfig>(dbRegToken),
          autoLoadEntities: true,
          logging: 'all',
          logger: new TypeORMLogger('all')
        }
      },
      // dataSource receives the configured DataSourceOptions
      // and returns a Promise<DataSource>.
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize()
        return dataSource
      }
    })
  ]
})
export class DatabaseModule {}
