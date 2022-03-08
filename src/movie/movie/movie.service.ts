import { MovieCategory, MovieCategoryDocument } from 'shared/models/moviecateogy.schema';
import { CreateMovieDto, UpdateMovieDto } from './models/movie.model';
import { from, map, Observable, switchMap, tap } from 'rxjs';
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
      ...selectQuery,
    ]);

    return from(query.exec()).pipe(
      map((movieList) => movieList[0] ?? null),
    );
  }

  async create(createMovieDto: CreateMovieDto): Promise<Observable<Movie>> {
    const { categories, ...createData } = createMovieDto;
    const createdMovie = new this.model(createData);

    if (categories) {
      await this.addCategories(createdMovie._id, categories);
    }

    return from(createdMovie.save()).pipe(switchMap(() => this.findById(createdMovie._id)));
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Observable<Movie>> {
    const { categories, ...updateData } = updateMovieDto;
    const { poster } = updateData;
    const query = this.model.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    if (categories) {
      await this.updateCategories(id, categories);
    }

    return from(query.exec()).pipe(
      tap((movie) => {
        if (poster && movie.poster !== poster && movie.poster) {
          this.appService.removeUploadImage(movie.poster, 'posters');
        }
      }),
      switchMap(() => this.findById(id))
    );
  }

  delete(_id: string): Observable<boolean> {
    const query = this.model.findByIdAndRemove(_id);

    this.movieCategoryModel.deleteMany({ movie: _id });

    return from(query.exec()).pipe(
      tap((movie) => {
        if (movie.poster) {
          this.appService.removeUploadImage(movie.poster, 'posters');
        }
      }),
      map((movie) => !movie.isDeleted),
    );
  }

  // ==========================
  // UTILS METHODS
  // ==========================
  private async addCategories(id: string, categories: string[]): Promise<any> {
    return await this.movieCategoryModel.insertMany(
      categories.map((category) => ({ movie: id, category: category })),
    );
  }

  private async updateCategories(id: string, categories: string[]): Promise<any> {
    return await this.movieCategoryModel.deleteMany({ movie: id }, () =>
      this.addCategories(id, categories),
    );
  }
}
