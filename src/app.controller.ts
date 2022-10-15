import {
  CacheKey,
  CacheTTL,
  Controller,
  Get,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import { AppService } from './app.service';
//@UseInterceptors(CacheInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  //@CacheKey('appcontrollers')
  //@CacheTTL(10000)
  getAllProduct() {
    return this.appService.getAllProduct();
  }

  fakeModel = {
    id: 1,
    name: 'John Doeeee',
    email: 'okee@gmail.com',
    phone: '123456789',
    address: '123 Main St',
    createdAt: new Date(),
  };

  @Get('auto-caching')
  @CacheKey('auto-caching-fake-model')
  @CacheTTL(1000)
  getAutoCaching() {
    return this.fakeModel;
  }
}
