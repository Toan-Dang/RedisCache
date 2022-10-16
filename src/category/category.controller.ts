import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getAllCategory() {
    return this.categoryService.getAllCategory();
  }

  @Get('phone')
  getPhoneCategory() {
    return this.categoryService.getPhoneCategory();
  }

  @Get('laptop')
  getLapCategory() {
    return this.categoryService.getLapCategory();
  }
}
