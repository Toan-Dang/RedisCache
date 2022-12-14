import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { redisClient } from 'src/constanst';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async getSearch(str: string) {
    // const redis = new Redis(
    //   'redis://default:KeISWjEGQQSTgzYIXdoLpq4U9cKzjqBx@redis-13748.c61.us-east-1-3.ec2.cloud.redislabs.com:13748',
    // );
    const client = redisClient;
    await client.connect();

    try {
      const resSearch = await client.json.GET(str);
      if (resSearch) {
        await client.disconnect();
        return resSearch;
      }
      // const resSearch = await redis.get(str);
      const product = await this.prisma.product.findMany({
        where: {
          OR: [
            {
              ProductName: {
                contains: str,
                mode: 'insensitive',
              },
            },
            {
              CategoryName: {
                contains: str,
                mode: 'insensitive',
              },
            },
            {
              Type: {
                contains: str,
                mode: 'insensitive',
              },
            },
          ],
        },
        select: {
          Picture: true,
          ProductName: true,
          MSRP: true,
          UnitPrice: true,
          id: true,
        },
        distinct: ['ProductName'],
        //take: 5,
      });
      await client.json.SET(str, '$', product);
      await client.disconnect();
      return product;
    } catch (error) {
      await client.disconnect();
      return error;
    }
  }
}
