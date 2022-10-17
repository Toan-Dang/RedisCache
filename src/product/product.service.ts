import { AppService } from './../app.service';
import { Injectable } from '@nestjs/common';
import { redisClient } from 'src/constanst';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const redis = redisClient;
    await redis.connect();
    try {
      const productNew = await this.prisma.product.create({
        data: createProductDto,
      });
      await redis.flushAll();
      await this.addRedisProduct();
      await redis.disconnect();
      return 'This action adds a new product';
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

  async getProductbyID(proid: string) {
    const redis = redisClient;
    await redis.connect();
    const productId = await redis.json.GET(proid);
    if (productId) {
      await redis.disconnect();
      return productId;
    }

    const product = await this.prisma.product.findUnique({
      where: {
        id: proid,
      },
    });
    //cap nhat luot view cho sp
    await this.prisma.product.update({
      where: {
        id: proid,
      },
      data: {
        View: product.View + 1,
      },
    });

    const pro_name = await this.prisma.product.groupBy({
      by: ['Version', 'Color', 'id', 'Picture', 'UnitPrice'],
      where: {
        ProductName: product.ProductName,
      },
    });

    const pro_version = await this.prisma.product.groupBy({
      by: ['Version'],
      where: {
        ProductName: product.ProductName,
      },
    });

    const res = [];
    const temp = [];
    res.push({ prod: product });
    pro_name.forEach((i) => {
      temp.push({
        version: i.Version,
        color: i.Color,
        id: i.id,
        picture: i.Picture,
        price: i.UnitPrice,
      });
    });

    let temp_ver = [];
    let temp_col = [];
    let temp_id = [];
    let temp_pic = [];
    let temp_pri = [];
    let verblock = [];
    pro_version.forEach((ver) => {
      temp_ver.push(ver.Version);

      temp.forEach((col) => {
        if (ver.Version == col['version']) {
          temp_col.push(col['color']);
          temp_id.push(col['id']);
          temp_pic.push(col['picture']);
          temp_pri.push(col['price']);
        }
      });

      verblock.push({
        version: temp_ver,
        color: [temp_col, temp_id, temp_pic, temp_pri],
      });
      temp_ver = [];
      temp_col = [];
      temp_id = [];
      temp_pic = [];
      temp_pri = [];
    });
    res.push({ version: verblock });
    await redis.json.SET(proid, '$', res);
    await redis.disconnect();
    return res;
  }

  async getPhone() {
    const redis = redisClient;
    await redis.connect();
    const Phone = await redis.json.GET('phoneList');
    if (Phone) {
      await redis.disconnect();
      return Phone;
    }
    const phone = await this.prisma.product.findMany({
      where: {
        Type: 'Điện thoại',
      },
      select: {
        Picture: true,
        ProductName: true,
        MSRP: true,
        UnitPrice: true,
        id: true,
      },
      distinct: ['ProductName'],
    });
    await redis.json.SET('phoneList', '$', phone);
    await redis.disconnect();
    return phone;
  }

  async getLaptop() {
    const redis = redisClient;
    await redis.connect();
    const Laptop = await redis.json.GET('laptopList');
    if (Laptop) {
      await redis.disconnect();
      return Laptop;
    }
    const laptop = await this.prisma.product.findMany({
      where: {
        Type: 'Laptop',
      },
      select: {
        Picture: true,
        ProductName: true,
        MSRP: true,
        UnitPrice: true,
        id: true,
      },
      distinct: ['ProductName'],
    });
    await redis.json.SET('laptopList', '$', laptop);
    await redis.disconnect();
    return laptop;
  }

  async getPhoneByCategory(cate: string) {
    const redis = redisClient;
    await redis.connect();
    const str = cate + 'categoryofphone';
    const phoneCate = await redis.json.GET(str);
    if (phoneCate) {
      await redis.disconnect();
      return phoneCate;
    }
    const phoneCategory = await this.prisma.product.findMany({
      where: {
        Type: 'Điện thoại',
        CategoryName: cate,
      },
      distinct: ['ProductName'],
      select: {
        Picture: true,
        ProductName: true,
        MSRP: true,
        UnitPrice: true,
        id: true,
      },
    });
    await redis.json.SET(str, '$', phoneCategory);
    await redis.disconnect();
    return phoneCategory;
  }

  async getLapByCategory(cate: string) {
    const redis = redisClient;
    await redis.connect();
    const str = cate + 'categoryoflaptop';
    const lapCate = await redis.json.GET(str);
    if (lapCate) {
      await redis.disconnect();
      return lapCate;
    }
    const laptopCategory = await this.prisma.product.findMany({
      where: {
        Type: 'Laptop',
        CategoryName: cate,
      },
      distinct: ['ProductName'],
      select: {
        Picture: true,
        ProductName: true,
        MSRP: true,
        UnitPrice: true,
        id: true,
      },
    });
    await redis.json.SET(str, '$', laptopCategory);
    await redis.disconnect();
    return laptopCategory;
  }
}
