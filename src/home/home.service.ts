import { CategoryService } from './../category/category.service';
import { Injectable } from '@nestjs/common';
import { redisClient } from 'src/constanst';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HomeService {
  constructor(
    private prisma: PrismaService,
    private categoryService: CategoryService,
  ) {}

  async getHome() {
    const hotSale = await this.getHotSale();
    const phoneHot = await this.getPhoneHot();
    const lapHot = await this.getLapHot();
    const category = await this.categoryService.getAllCategory();
    return { hotSale, phoneHot, lapHot, category };
  }

  async getHotSale() {
    const redis = redisClient;

    try {
      await redis.connect();
      const redisHotSale = await redis.json.GET('hotSale');
      if (redisHotSale) {
        await redis.disconnect();
        return redisHotSale;
      }
      const hostSale = await this.prisma.product.findMany({
        orderBy: {
          sold: 'desc',
        },
        select: {
          Picture: true,
          ProductName: true,
          MSRP: true,
          UnitPrice: true,
          id: true,
        },
        where: {
          OR: [{ Type: 'Điện thoại' }, { Type: 'Laptop' }],
          NOT: [
            { ProductName: 'iPhone 11' },
            {
              ProductName: {
                contains: 'Samsung Galaxy Z',
              },
            },
          ],
        },
        distinct: ['ProductName'],
        take: 10,
      });
      await redis.json.SET('hotSale', '$', hostSale);
      await redis.disconnect();
      return hostSale;
    } catch (error) {
      await redis.disconnect();
      return error;
    }
  }

  async getPhoneHot() {
    const redis = redisClient;
    try {
      await redis.connect();
      const redisHotPhone = await redis.json.GET('hotPhone');
      if (redisHotPhone) {
        await redis.disconnect();
        return redisHotPhone;
      }
      const hotPhone = await this.prisma.product.findMany({
        orderBy: {
          View: 'desc',
        },
        select: {
          Picture: true,
          ProductName: true,
          MSRP: true,
          UnitPrice: true,
          id: true,
        },
        where: {
          Type: 'Điện thoại',
        },
        distinct: ['ProductName'],
        take: 10,
      });
      await redis.json.SET('hotPhone', '$', hotPhone);
      await redis.disconnect();
      return hotPhone;
    } catch (error) {
      await redis.disconnect();
      return error;
    }
  }

  async getLapHot() {
    const redis = redisClient;
    try {
      await redis.connect();
      const redisHotLap = await redis.json.GET('hotLap');
      if (redisHotLap) {
        await redis.disconnect();
        return redisHotLap;
      }
      const hotLap = await this.prisma.product.findMany({
        orderBy: {
          View: 'desc',
        },
        select: {
          Picture: true,
          ProductName: true,
          MSRP: true,
          UnitPrice: true,
          id: true,
        },
        where: {
          Type: 'Laptop',
        },
        distinct: ['ProductName'],
        take: 10,
      });
      await redis.json.SET('hotLap', '$', hotLap);
      await redis.disconnect();
      return hotLap;
    } catch (error) {
      await redis.disconnect();
      return error;
    }
  }
}
