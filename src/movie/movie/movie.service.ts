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
      map((animeList) => animeList.map((anime) => new MovieDto(anime).object)),
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
      map((anime) => new MovieDto(anime).object),
    );
  }

  /**
   *
   * @param createAnimeDto
   * @returns
   */
  create(createAnimeDto: CreateMovieDto): Observable<IMovieDto> {
    const createdAnime = new this.model(createAnimeDto);

    return from(createdAnime.save()).pipe(map((anime) => new MovieDto(anime).object));
  }

  /**
   *
   * @param _id
   * @param updateAnimeDto
   * @returns
   */
  update(_id: string, updateAnimeDto: UpdateMovieDto): Observable<IMovieDto> {
    const { poster } = updateAnimeDto;
    const query = this.model.findOneAndUpdate(
      { _id },
      { $set: { ...updateAnimeDto, updatedTime: Date.now() } },
    );

    return from(query.exec()).pipe(
      defaultIfEmpty(MovieDto.emptyObject),
      tap(anime => {
        if(anime.poster !== poster && anime.poster) {
          this.appService.removeUploadImage(anime.poster as string);
        }
      }),
      map((anime) => new MovieDto(anime).object),
    );
  }

  /**
   *
   * @param _id
   * @returns
   */
  delete(_id: string): Observable<boolean> {
    const query = this.model.findOneAndUpdate({ _id }, { $set: { isDeleted: true } });

    return from(query.exec()).pipe(map((anime) => anime.isDeleted));
  }
}
