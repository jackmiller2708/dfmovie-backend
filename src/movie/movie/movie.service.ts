import { MovieCategory, MovieCategoryDocument } from '../moviecategory/moviecategory.schema';
import { CreateMovieDto, UpdateMovieDto } from './models/movie.model';
import { from, map, Observable, tap } from 'rxjs';
import { Movie, MovieDocument } from './models/movie.schema';
import { InjectModel } from '@nestjs/mongoose';
import { AppService } from 'src/app.service';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class MovieService {
  get movieQuery(): any[] {
    return [
      { $project: { isDeleted: 0, __v: 0 } },
      {
        $lookup: {
          from: 'moviecategories',
          localField: '_id',
          foreignField: 'movie',
          pipeline: [
            { $project: { _id: 0, __v: 0, movie: 0 } },
            {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category',
              },
            },
            { $unwind: { path: '$category' } },
            {
              $group: {
                _id: '$category._id',
                name: { $first: '$category.name' },
                translationKey: { $first: '$category.translationKey' },
                createdTime: { $first: '$category.createdTime' },
                updatedTime: { $first: '$category.updatedTime' },
              },
            },
          ],
          as: 'categories',
        },
      },
    ];
  }

  constructor(
    @InjectModel(Movie.name) private readonly model: Model<MovieDocument>,
    @InjectModel(MovieCategory.name)
    private readonly movieCategory: Model<MovieCategoryDocument>,
    private readonly appService: AppService,
  ) {}

  /**
   *
   * @returns
   */
  findAll(): Observable<Movie[]> {
    const query = this.model.aggregate([{ $match: { isDeleted: false } }, ...this.movieQuery]);

    return from(query.exec());
  }

  /**
   *
   * @param _id
   * @returns
   */
  findById(_id: string): Observable<Movie> {
    const query = this.model.aggregate([
      {
        $match: {
          $expr: { $eq: ['$_id', { $toObjectId: _id }] },
          isDeleted: false,
        },
      },
      { $project: { _id: 0 } },
      ...this.movieQuery,
    ]);

    return from(query.exec()).pipe(map((movies) => movies[0] ?? null));
  }

  /**
   *
   * @param createMovieDto
   * @returns
   */
  create(createMovieDto: CreateMovieDto): Observable<Movie> {
    const { categories } = createMovieDto;
    const createdMovie = new this.model(createMovieDto);

    if (categories) {
      this.movieCategory.insertMany(
        categories.map((category) => ({
          movie: createdMovie._id,
          category: category,
        })),
      );
    }

    return from(createdMovie.save());
  }

  /**
   *
   * @param _id
   * @param updateMovieDto
   * @returns
   */
  update(_id: string, updateMovieDto: UpdateMovieDto): Observable<Movie> {
    const { poster, categories, ...updatedData } = updateMovieDto;

    if (poster) {
      (updatedData as any).poster = poster;
    }

    const query = this.model.findOneAndUpdate(
      { _id },
      { $set: { ...updatedData, updatedTime: Date.now() } },
    );
    query.projection({ __v: 0, isDeleted: 0 });

    if (categories) {
      this.movieCategory.deleteMany({ movies: _id }, () => {
        this.movieCategory.insertMany(
          categories.map((category) => ({
            category: category,
            movie: _id,
          })),
        );
      });
    }

    return from(query.exec()).pipe(
      tap((movie) => {
        if (poster && movie.poster !== poster && movie.poster) {
          this.appService.removeUploadImage(movie.poster as string);
        }
      }),
    );
  }

  /**
   *
   * @param _id
   * @returns
   */
  delete(_id: string): Observable<boolean> {
    const query = this.model.findOneAndUpdate(
      { _id },
      { $set: { isDeleted: true } },
    );

    return from(query.exec()).pipe(map((movie) => !movie.isDeleted));
  }
}
