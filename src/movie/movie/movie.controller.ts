import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MovieDto, CreateMovieDto, IMovieDto, UpdateMovieDto } from './models/movie.model';
import { NotAcceptableException } from 'shared/httpExceptions';
import { Express, Response } from 'express'
import { FileInterceptor } from '@nestjs/platform-express';
import { MovieService } from './movie.service';
import { AppService } from 'src/app.service';
import { Observable } from 'rxjs';

@Controller('movie')
export class MovieController {
  constructor(
    private readonly service: MovieService,
    private readonly appService: AppService
  ) {}

  @Get()
  findAll(): Observable<IMovieDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Observable<IMovieDto> {
    return this.service.findById(id);
  }

  @Get('/poster/:filename')
  findMoviePoster(@Param('filename') filename: string, @Res() res: Response): Response {
    const file = this.appService.getUploadedImage(filename);
    return file.pipe(res);
  }

  @Post()
  @UseInterceptors(FileInterceptor('poster'))
  create(@UploadedFile() poster: Express.Multer.File, @Body() createMovieDto: CreateMovieDto): Observable<IMovieDto> {
    const newRequestedMovie = new MovieDto({ _id: 'dummyId', ...createMovieDto, poster: poster?.filename });
    const { missingProperties } = newRequestedMovie;

    if (missingProperties.length) {
      throw new NotAcceptableException(JSON.stringify({ missingProperties }));
    }

    return this.service.create({ ...createMovieDto, poster: poster?.filename });
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('poster'))
  update(@Param('id') id: string, @UploadedFile() poster: Express.Multer.File, @Body() updateMovieDto: UpdateMovieDto): Observable<IMovieDto> {
    if (!Object.values(updateMovieDto).length && !poster) {
      throw new NotAcceptableException('Must have at least one property to update');
    }

    return this.service.update(id, {...updateMovieDto, poster: poster?.filename});
  }

  @Delete(':id')
  delete(id: string): Observable<boolean> {
    return this.service.delete(id);
  }
}
