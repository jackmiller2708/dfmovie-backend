import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:OimXWaPJHMHmj5m3@cluster0.taaut.mongodb.net/AnimeReview',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
