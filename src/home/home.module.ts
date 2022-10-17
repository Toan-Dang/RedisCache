import { CategoryModule } from './../category/category.module';
import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';

@Module({
  imports:[CategoryModule],
  controllers: [HomeController],
  providers: [HomeService]
})
export class HomeModule {}
