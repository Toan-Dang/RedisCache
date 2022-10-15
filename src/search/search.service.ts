import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import Redis from 'ioredis';
import { createClient } from 'redis';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async getSearch(str: string) {
    // const redis = new Redis(
    //   'redis://default:KeISWjEGQQSTgzYIXdoLpq4U9cKzjqBx@redis-13748.c61.us-east-1-3.ec2.cloud.redislabs.com:13748',
    // );
    const client = createClient({
      url: 'redis://default:KeISWjEGQQSTgzYIXdoLpq4U9cKzjqBx@redis-13748.c61.us-east-1-3.ec2.cloud.redislabs.com:13748',
      socket: {
        connectTimeout: 50000,
      },
    });
    //const client = createClient({ url: 'redis://localhost:6379' });
    await client.connect();

    try {
      const resSearch = await client.json.GET(str);
      if (resSearch) {
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
      return error;
    }
  }
}
