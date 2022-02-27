import { MovieCategory, MovieCategorySchema } from 'shared/models/moviecateogy.schema';
import { Category, CategorySchema } from './category/models/category.schema';
import { CategoryController } from './category/category.controller';
import { Movie, MovieSchema } from './movie/models/movie.schema';
import { MovieController } from './movie/movie.controller';
import { CategoryService } from './category/category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { MovieService } from './movie/movie.service';
import { diskStorage } from 'multer';
import { AppService } from 'src/app.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
      { name: MovieCategory.name, schema: MovieCategorySchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: 'uploads/poster',
        filename: function (req, file, cb) {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.originalname + '-' + uniqueSuffix);
        },
      }),
    }),
  ],
  controllers: [MovieController, CategoryController],
  providers: [MovieService, CategoryService, AppService],
})
export class MovieModule {}
