import { PrismaModule } from './prisma/prisma.module';
import { CacheModule, Module, CacheInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SearchModule } from './search/search.module';
import { HomeModule } from './home/home.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import * as redis from 'redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // CacheModule.register({
    //   store: redisStore,
    //   host: 'localhost',
    //   port: 6379,
    // }),
    PrismaModule,
    SearchModule,
    HomeModule,
    ProductModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule {}
