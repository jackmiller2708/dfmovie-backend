import { MovieCategorySchema, MovieCategory } from './moviecategory/moviecategory.schema';
import { Category, CategorySchema } from './category/models/category.schema';
import { CategoryController } from './category/category.controller';
import { Movie, MovieSchema } from './movie/models/movie.schema';
import { CategoryService } from './category/category.service';
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
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
      { name: MovieCategory.name, schema: MovieCategorySchema},
      { name: Category.name, schema: CategorySchema}
    ]),
  ],
  controllers: [MovieController, CategoryController],
  providers: [MovieService, AppService, CategoryService],
})
export class MovieModule {}
