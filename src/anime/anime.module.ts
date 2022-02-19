import { Anime, AnimeSchema } from './anime/models/anime.schema';
import { AnimeController } from './anime/anime.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimeService } from './anime/anime.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [MongooseModule.forFeature([{ name: Anime.name, schema: AnimeSchema }])],
  controllers: [AnimeController],
  providers: [AnimeService]
})
export class AnimeModule {}
