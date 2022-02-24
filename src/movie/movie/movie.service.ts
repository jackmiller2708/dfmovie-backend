import { MovieCategory, MovieCategoryDocument } from 'shared/models/moviecateogy.schema';
import { CreateMovieDto, UpdateMovieDto } from './models/movie.model';
import { from, map, Observable, tap } from 'rxjs';
import { Movie, MovieDocument } from './models/movie.schema';
import { InjectModel } from '@nestjs/mongoose';
import { selectQuery } from './movie.query';
import { AppService } from 'src/app.service';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private readonly model: Model<MovieDocument>,
    @InjectModel(MovieCategory.name)
    private readonly movieCategoryModel: Model<MovieCategoryDocument>,
    private readonly appService: AppService,
  ) {}

  findAll(): Observable<Movie[]> {
    const query = this.model.aggregate(selectQuery);

    return from(query.exec());
  }

  findById(_id: string): Observable<Movie> {
    const query = this.model.aggregate([
      { $match: { $expr: { $eq: ['$_id', { $toObjectId: _id }] } } },
      { $project: { _id: 0 }},
      ...selectQuery,
    ]);

    return from(query.exec()).pipe(
      map((movieList) => movieList[0] ?? null),
    );
  }

  create(createMovieDto: CreateMovieDto): Observable<Movie> {
    const { categories, ...createData } = createMovieDto;
    const createdMovie = new this.model(createData);

    if (categories) {
      this.addCategories(createdMovie._id, categories);
    }

    return from(createdMovie.save());
  }

  update(id: string, updateMovieDto: UpdateMovieDto): Observable<Movie> {
    const { categories, ...updateData } = updateMovieDto;
    const { poster } = updateData;
    const query = this.model.findByIdAndUpdate(id, { $set: updateData }, { returnOriginal: false });

    if (categories) {
      this.addCategories(id, categories);
    }

    return from(query.exec()).pipe(
      tap((movie) => {
        if (poster && movie.poster !== poster && movie.poster) {
          this.appService.removeUploadImage(movie.poster);
        }
      }),
    );
  }

  delete(_id: string): Observable<boolean> {
    const query = this.model.findByIdAndRemove(_id, {}, () => {
      this.movieCategoryModel.deleteMany({ movie: _id });
    });

    return from(query.exec()).pipe(
      tap((movie) => {
        if (movie.poster) {
          this.appService.removeUploadImage(movie.poster);
        }
      }),
      map((movie) => !movie.isDeleted),
    );
  }

  // ==========================
  // UTILS METHODS
  // ==========================
  private addCategories(id: string, categories: string[]): void {
    this.movieCategoryModel.insertMany(
      categories.map((category) => ({ movie: id, category: category })),
    );
  }

  private updateCategory(id: string, categories: string[]): void {
    this.movieCategoryModel.deleteMany({ movie: id }, () =>
      this.addCategories(id, categories),
    );
  }
}
