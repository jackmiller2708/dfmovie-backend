import { AnimeDto, CreateAnimeDto, IAnimeDto, UpdateAnimeDto } from './models/anime.model';
import { defaultIfEmpty, from, map, Observable } from 'rxjs';
import { Anime, AnimeDocument } from './models/anime.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { AppService } from 'src/app.service';

@Injectable()
export class AnimeService {
  constructor(
    @InjectModel(Anime.name) private readonly model: Model<AnimeDocument>,
    private readonly appService: AppService
  ) {}

  /**
   *
   * @returns
   */
  findAll(): Observable<IAnimeDto[]> {
    const query = this.model.find();

    return from(query.exec()).pipe(
      map((animeList) => animeList.map((anime) => new AnimeDto(anime).object)),
    );
  }

  /**
   *
   * @param _id
   * @returns
   */
  findById(_id: string): Observable<IAnimeDto> {
    const query = this.model.findOne({ _id });

    return from(query.exec()).pipe(
      defaultIfEmpty(AnimeDto.emptyObject),
      map((anime) => new AnimeDto(anime).object),
    );
  }

  /**
   *
   * @param createAnimeDto
   * @returns
   */
  create(createAnimeDto: CreateAnimeDto): Observable<IAnimeDto> {
    const createdAnime = new this.model(createAnimeDto);

    return from(createdAnime.save()).pipe(map((anime) => new AnimeDto(anime).object));
  }

  /**
   *
   * @param _id
   * @param updateAnimeDto
   * @returns
   */
  update(_id: string, updateAnimeDto: UpdateAnimeDto): Observable<IAnimeDto> {
    const query = this.model.findOneAndUpdate(
      { _id },
      { $set: { ...updateAnimeDto, updatedTime: Date.now() } },
    );

    return from(query.exec()).pipe(map((anime) => new AnimeDto(anime).object));
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
