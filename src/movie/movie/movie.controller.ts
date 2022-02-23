import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateMovieDto, UpdateMovieDto } from './models/movie.model';
import { NotAcceptableException } from 'shared/httpExceptions';
import { Express, Response } from 'express'
import { FileInterceptor } from '@nestjs/platform-express';
import { MovieService } from './movie.service';
import { AppService } from 'src/app.service';
import { Observable } from 'rxjs';
import { Movie } from './models/movie.schema';

@Controller('movie')
export class MovieController {
  constructor(
    private readonly service: MovieService,
    private readonly appService: AppService
  ) {}

  @Get()
  findAll(): Observable<Movie[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Observable<Movie> {
    return this.service.findById(id);
  }

  @Get('/poster/:filename')
  findMoviePoster(@Param('filename') filename: string, @Res() res: Response): Response {
    const file = this.appService.getUploadedImage(filename);
    return file.pipe(res);
  }

  @Post()
  @UseInterceptors(FileInterceptor('poster'))
  create(@UploadedFile() poster: Express.Multer.File, @Body() createMovieDto: CreateMovieDto): Observable<Movie> {
        return this.service.create({ ...createMovieDto, poster: poster?.filename });
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('poster'))
  update(@Param('id') id: string, @UploadedFile() poster: Express.Multer.File, @Body() updateMovieDto: UpdateMovieDto): Observable<Movie> {
    if (!Object.values(updateMovieDto).length && !poster) {
      throw new NotAcceptableException('Must have at least one property to update');
    }

    return this.service.update(id, { ...updateMovieDto, poster: poster?.filename });
  }

  @Delete(':id')
  delete(@Param('id') id: string): Observable<boolean> {
    return this.service.delete(id);
  }
}
