import { redisClient } from './../constanst';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAllCategory() {
    const laptop = await this.getLapCategory();
    const phone = await this.getPhoneCategory();
    return { laptop, phone };
  }

  async getPhoneCategory() {
    const redis = redisClient;
    try {
      await redis.connect();
      const redisPhoneCategory = await redis.json.GET('phoneCategory');
      if (redisPhoneCategory) {
        await redis.disconnect();
        return redisPhoneCategory;
      }

      const phoneCategory = await this.prisma.category.findMany({
        where: {
          Type: 'Điện thoại',
        },
        select: {
          CategoryName: true,
          Picture: true,
        },
      });
      await redis.json.SET('phoneCategory', '$', phoneCategory);
      await redis.disconnect();
      return phoneCategory;
    } catch (error) {
      await redis.disconnect();
      return error;
    }
  }

  async getLapCategory() {
    const redis = redisClient;
    try {
      await redis.connect();
      const redisLapCategory = await redis.json.GET('lapCategory');
      if (redisLapCategory) {
        await redis.disconnect();
        return redisLapCategory;
      }
      const lapCategory = await this.prisma.category.findMany({
        where: {
          Type: 'Laptop',
        },
        select: {
          CategoryName: true,
          Picture: true,
        },
      });
      await redis.json.SET('lapCategory', '$', lapCategory);
      await redis.disconnect();
      return lapCategory;
    } catch (error) {
      await redis.disconnect();
      return error;
    }
  }
}
