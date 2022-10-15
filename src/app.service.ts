import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
//import { Cache } from 'cache-manager';
import Redis from 'ioredis';
@Injectable()
export class AppService {
  //constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getHello() {
    // await this.cacheManager.set('key5', 'value3', { ttl: 20000 });
    // const val = await this.cacheManager.get('key');

    const redis = new Redis(
      'redis://default:KeISWjEGQQSTgzYIXdoLpq4U9cKzjqBx@redis-13748.c61.us-east-1-3.ec2.cloud.redislabs.com:13748',
    );

    await redis.set('key20-', 'value2');

    // if (val)
    //{
    return {
      // data: val,
      FromRedis: 'this is loaded from redis cache',
    };
    // }
    //  return 'Hello World!';
  }
}
