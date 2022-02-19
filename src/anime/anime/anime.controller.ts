import { AnimeDto, CreateAnimeDto, IAnimeDto, UpdateAnimeDto } from './models/anime.model';
import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { NotAcceptableException } from 'shared/httpExceptions';
import { AnimeService } from './anime.service';
import { Observable } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'

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
  @UseInterceptors(FileInterceptor('poster'))
  create(
    @UploadedFile() poster: Express.Multer.File,
    @Body() createAnimeDto: CreateAnimeDto,
  ): Observable<IAnimeDto> {
    const requestedNewAnime = new AnimeDto({ _id: 'dummyId', ...createAnimeDto, poster: poster?.originalname });
    const { missingProperties } = requestedNewAnime;

    if (missingProperties.length) {
      throw new NotAcceptableException(JSON.stringify({ missingProperties }));
    }

    return this.service.create(({...createAnimeDto, poster: poster?.originalname}));
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnimeDto: UpdateAnimeDto,
  ): Observable<IAnimeDto> {
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
