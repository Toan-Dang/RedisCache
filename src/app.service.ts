import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
//import { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { PrismaService } from './prisma/prisma.service';
import { createClient } from 'redis';

@Injectable()
export class AppService {
  //constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  constructor(private prisma: PrismaService) {}

  async getAllProduct(str = 'all') {
    const redis = createClient({
      url: 'redis://default:KeISWjEGQQSTgzYIXdoLpq4U9cKzjqBx@redis-13748.c61.us-east-1-3.ec2.cloud.redislabs.com:13748',
      socket: {
        connectTimeout: 50000,
      },
    });
    await redis.connect();

    try {
      const resSearch = await redis.json.GET(str);
      if (resSearch) {
        return resSearch;
      }
      // const resSearch = await redis.get(str);
      const product = await this.prisma.product.findMany({});
      await redis.json.SET(str, '$', product);
      await redis.disconnect();
      return product;
    } catch (error) {
      return error;
    }
  }
}
