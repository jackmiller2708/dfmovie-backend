import { Movie, MovieSchema } from './movie/models/movie.schema';
import { MovieController } from './movie/movie.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { MovieService } from './movie/movie.service';
import { diskStorage } from 'multer';
import { AppService } from 'src/app.service';
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
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  controllers: [MovieController],
  providers: [MovieService, AppService],
})
export class MovieModule {}
