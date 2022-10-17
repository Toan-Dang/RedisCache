import { UpdateProductDto } from './product/dto/update-product.dto';
import { redisClient } from './constanst';
import { Injectable } from '@nestjs/common';
//import { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  //constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  constructor(private prisma: PrismaService) {}

  async getAllProduct(str = 'all') {
    const redis = redisClient;
    await redis.connect();

    try {
      const resSearch = await redis.json.GET(str);
      if (resSearch) {
        await redis.disconnect();
        return resSearch;
      }
      // const resSearch = await redis.get(str);
      const product = await this.prisma.product.findMany({});
      await redis.json.SET(str, '$', product);
      await redis.disconnect();
      return product;
    } catch (error) {
      await redis.disconnect();
      return error;
    }
  }

  async addRedisProduct() {
    const redis = redisClient;
    await redis.connect();

    try {
      const product = await this.prisma.product.findMany({});
      for (let pro of product) {
        await redis.json.SET(pro.id, '$', pro);
      }
      await redis.disconnect();
      return;
    } catch (error) {
      await redis.disconnect();
      return error;
    }
  }
}
