import { Anime, AnimeSchema } from './anime/models/anime.schema';
import { AnimeController } from './anime/anime.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { AnimeService } from './anime/anime.service';
import { diskStorage } from 'multer';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.originalname + '-' + uniqueSuffix);
        },
      }),
    }),
    MongooseModule.forFeature([{ name: Anime.name, schema: AnimeSchema }]),
  ],
  controllers: [AnimeController],
  providers: [AnimeService],
})
export class AnimeModule {}
