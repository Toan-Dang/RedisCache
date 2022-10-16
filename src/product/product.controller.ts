import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get('phone')
  getPhone() {
    return this.productService.getPhone();
  }

  @Get('laptop')
  getLaptop() {
    return this.productService.getLaptop();
  }

  @Get(':id')
  getProductById(@Param('id') productid: string) {
    return this.productService.getProductbyID(productid);
  }

  @Get('/phone/:phonecategory')
  getPhonebyCategory(@Param('phonecategory') cate: string) {
    console.log(cate);
    return this.productService.getPhoneByCategory(cate);
  }

  @Get('/laptop/:lapcategory')
  getLapbyCategory(@Param('lapcategory') cate: string) {
    console.log(cate);
    return this.productService.getLapByCategory(cate);
  }
}
