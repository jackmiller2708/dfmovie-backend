import { AnimeDto, CreateAnimeDto, IAnimeDto, UpdateAnimeDto } from './models/anime.model';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { NotAcceptableException } from 'shared/httpExceptions';
import { AnimeService } from './anime.service';
import { Observable } from 'rxjs';

@Controller('anime')
export class AnimeController {
  constructor(private readonly service: AnimeService) {}

  @Get()
  findAll(): Observable<IAnimeDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Observable<IAnimeDto> {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() createAnimeDto: CreateAnimeDto): Observable<IAnimeDto> {
    const requestedNewAnime = new AnimeDto({ _id: 'dummyId', ...createAnimeDto });
    const { missingProperties } = requestedNewAnime;

    if (missingProperties.length) {
      throw new NotAcceptableException(JSON.stringify({ missingProperties }));
    }

    return this.service.create(createAnimeDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnimeDto: UpdateAnimeDto,
  ): Observable<any> {
    if (!Object.values(updateAnimeDto).length) {
      throw new NotAcceptableException(
        'Must have at least one property to update',
      );
    }

    return this.service.update(id, updateAnimeDto);
  }

  @Delete(':id')
  delete(id: string): Observable<any> {
    return this.service.delete(id);
  }
}
