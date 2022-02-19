import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AnimeDto, CreateAnimeDto, IAnimeDto, UpdateAnimeDto } from './models/anime.model';
import { NotAcceptableException } from 'shared/httpExceptions';
import { Express, Response } from 'express'
import { FileInterceptor } from '@nestjs/platform-express';
import { AnimeService } from './anime.service';
import { AppService } from 'src/app.service';
import { Observable } from 'rxjs';

@Controller('anime')
export class AnimeController {
  constructor(
    private readonly service: AnimeService,
    private readonly appService: AppService
  ) {}

  @Get()
  findAll(): Observable<IAnimeDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Observable<IAnimeDto> {
    return this.service.findById(id);
  }

  @Get('/poster/:filename')
  findAnimePoster(@Param('filename') filename: string, @Res() res: Response): any {
    const file = this.appService.getUploadedImage(filename);
    return file.pipe(res);
  }

  @Post()
  @UseInterceptors(FileInterceptor('poster'))
  create(@UploadedFile() poster: Express.Multer.File, @Body() createAnimeDto: CreateAnimeDto): Observable<IAnimeDto> {
    const requestedNewAnime = new AnimeDto({ _id: 'dummyId', ...createAnimeDto, poster: poster?.filename });
    const { missingProperties } = requestedNewAnime;

    if (missingProperties.length) {
      throw new NotAcceptableException(JSON.stringify({ missingProperties }));
    }

    return this.service.create({ ...createAnimeDto, poster: poster?.filename });
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('poster'))
  update(@Param('id') id: string, @UploadedFile() poster: Express.Multer.File, @Body() updateAnimeDto: UpdateAnimeDto): Observable<IAnimeDto> {
    if (!Object.values(updateAnimeDto).length && !poster) {
      throw new NotAcceptableException('Must have at least one property to update');
    }

    return this.service.update(id, {...updateAnimeDto, poster: poster?.originalname});
  }

  @Delete(':id')
  delete(id: string): Observable<boolean> {
    return this.service.delete(id);
  }
}
