import { Controller, Get } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('hotsale')
  getHotSale() {
    return this.homeService.getHotSale();
  }

  @Get('phonehot')
  getPhoneHot() {
    return this.homeService.getPhoneHot();
  }

  @Get('laphot')
  getLapHot() {
    return this.homeService.getLapHot();
  }
}
