import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize()
        return dataSource
      },
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DATABASE_HOST'),
          port: configService.get('DATABASE_PORT'),
          username: configService.get('DATABASE_USERNAME'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          entities: ['dist/modules/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: true,
          useNewUrlParser: true
        } as TypeOrmModuleOptions
      }
    })
  ]
})
export class DatabaseModule {}
