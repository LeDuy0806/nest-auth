import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { redisStore } from 'cache-manager-ioredis-yet'
import { ConfigKeyPaths } from '.'

@Injectable()
export class CacheConfig implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService<ConfigKeyPaths>) {}

  async createCacheOptions(): Promise<CacheModuleOptions> {
    const ttl = this.configService.get<number>('security.accessExpireIn') * 1000

    return {
      store: await redisStore({
        ...this.configService.get('redis'),
        ttl
      })
    }
  }
}
