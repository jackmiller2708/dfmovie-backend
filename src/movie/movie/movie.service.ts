import { MovieDto, CreateMovieDto, IMovieDto, UpdateMovieDto } from './models/movie.model';
import { defaultIfEmpty, filter, from, map, Observable, tap } from 'rxjs';
import { Movie, MovieDocument } from './models/movie.schema';
import { InjectModel } from '@nestjs/mongoose';
import { AppService } from 'src/app.service';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private readonly model: Model<MovieDocument>,
    private readonly appService: AppService
  ) {}

  /**
   *
   * @returns
   */
  findAll(): Observable<IMovieDto[]> {
    const query = this.model.find();

    return from(query.exec()).pipe(
      map((movieList) => movieList.map((movie) => new MovieDto(movie).object)),
    );
  }

  /**
   *
   * @param _id
   * @returns
   */
  findById(_id: string): Observable<IMovieDto> {
    const query = this.model.findOne({ _id });

    return from(query.exec()).pipe(
      defaultIfEmpty(MovieDto.emptyObject),
      map((movie) => new MovieDto(movie).object),
    );
  }

  /**
   *
   * @param createMovieDto
   * @returns
   */
  create(createMovieDto: CreateMovieDto): Observable<IMovieDto> {
    const createdMovie = new this.model(createMovieDto);

    return from(createdMovie.save()).pipe(map((movie) => new MovieDto(movie).object));
  }

  /**
   *
   * @param _id
   * @param updateMovieDto
   * @returns
   */
  update(_id: string, updateMovieDto: UpdateMovieDto): Observable<IMovieDto> {
    const { poster } = updateMovieDto;
    const query = this.model.findOneAndUpdate(
      { _id },
      { $set: { ...updateMovieDto, updatedTime: Date.now() } },
    );

    return from(query.exec()).pipe(
      defaultIfEmpty(MovieDto.emptyObject),
      tap(movie => {
        if(movie.poster !== poster && movie.poster) {
          this.appService.removeUploadImage(movie.poster as string);
        }
      }),
      map((movie) => new MovieDto(movie).object),
    );
  }

  /**
   *
   * @param _id
   * @returns
   */
  delete(_id: string): Observable<boolean> {
    const query = this.model.findOneAndUpdate({ _id }, { $set: { isDeleted: true } });

    return from(query.exec()).pipe(map((movie) => movie.isDeleted));
  }
}
