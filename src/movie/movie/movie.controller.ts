import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateMovieDto, UpdateMovieDto } from './models/movie.model';
import { NotAcceptableException } from 'shared/httpExceptions';
import { Express, Response } from 'express'
import { FileInterceptor } from '@nestjs/platform-express';
import { MovieService } from './movie.service';
import { AppService } from 'src/app.service';
import { Observable } from 'rxjs';
import { Movie } from './models/movie.schema';
import { Public } from 'shared/decorators/PublicRoute.decorator';
import { Authorize } from 'shared/decorators/Authorize.decorator';
import { Permissions } from 'src/auth/auth.permission';

@Controller('movies')
export class MovieController {
  constructor(
    private readonly service: MovieService,
    private readonly appService: AppService,
  ) {}

  @Get()
  @Public()
  findAll(): Observable<Movie[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @Public()
  findById(@Param('id') id: string): Observable<Movie> {
    return this.service.findById(id);
  }

  @Get('/poster/:filename')
  @Public()
  findMoviePoster(@Param('filename') filename: string, @Res() res: Response): Response {
    const file = this.appService.getUploadedImage(filename, 'posters');
    return file.pipe(res);
  }

  @Post()
  @Authorize(Permissions.Pages_Movies_Create)
  @UseInterceptors(FileInterceptor('poster'))
  create(@UploadedFile() poster: Express.Multer.File, @Body() createMovieDto: CreateMovieDto): Promise<Observable<Movie>> {
    return this.service.create({ ...createMovieDto, poster: poster?.filename });
  }

  @Put(':id')
  @Authorize(Permissions.Pages_Movies_Update)
  @UseInterceptors(FileInterceptor('poster'))
  update(@Param('id') id: string, @UploadedFile() poster: Express.Multer.File, @Body() updateMovieDto: UpdateMovieDto): Promise<Observable<Movie>> {
    if (!Object.values(updateMovieDto).length && !poster) {
      throw new NotAcceptableException('Must have at least one property to update');
    }

    return this.service.update(id, { ...updateMovieDto, poster: poster?.filename });
  }

  @Delete(':id')
  @Authorize(Permissions.Pages_Movies_Delete)
  delete(@Param('id') id: string): Observable<boolean> {
    return this.service.delete(id);
  }
}
