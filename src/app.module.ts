import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from 'shared/transform.interceptor';
import { HttpExceptionFilter } from 'shared/execption.filter';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:OimXWaPJHMHmj5m3@cluster0.taaut.mongodb.net/MovieReview',
    ),
    MovieModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    AppService,
  ],
})
export class AppModule {}
