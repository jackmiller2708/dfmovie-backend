import { Anime, AnimeDocument } from './models/anime.schema';
import { from, map, Observable } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { AnimeDto, CreateAnimeDto, IAnimeDto, UpdateAnimeDto } from './models/anime.model';

@Injectable()
export class AnimeService {
  constructor(
    @InjectModel(Anime.name) private readonly model: Model<AnimeDocument>,
  ) {}

  findAll(): Observable<IAnimeDto[]> {
    const query = this.model.find();

    return from(query.exec()).pipe(
      map((animeList) => animeList.map((anime) => new AnimeDto(anime).object)),
    );
  }

  findById(_id: string): Observable<IAnimeDto> {
    const query = this.model.findOne({ _id });

    return from(query.exec()).pipe(map((anime) => new AnimeDto(anime).object));
  }

  create(createAnimeDto: CreateAnimeDto): Observable<IAnimeDto> {
    const createdAnime = new this.model(createAnimeDto);

    return from(createdAnime.save()).pipe(map((anime) => new AnimeDto(anime).object));
  }

  update(_id: string, updateAnimeDto: UpdateAnimeDto): Observable<any> {
    const query = this.model.updateOne({ _id }, { $set: updateAnimeDto });

    return from(query.exec());
  }

  delete(_id: string): Observable<any> {
    const query = this.model.updateOne({ _id }, { $set: { isDeleted: true } });

    return from(query.exec());
  }
}
