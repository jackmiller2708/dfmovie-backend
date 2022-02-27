import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../../admin/users/models/user.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { User } from './models/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  findAll(): Observable<User[]> {
    return this.service.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('pfp'))
  create(@UploadedFile() pfp: Express.Multer.File, @Body() createUserDto: CreateUserDto): Observable<User> {
    return this.service.create({ ...createUserDto, pfp: pfp?.filename });
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('pfp'))
  update(@Param('id') id: string, @UploadedFile() pfp: Express.Multer.File, @Body() updateUserDto: UpdateUserDto): Observable<User> {
    return this.service.update(id, { ...updateUserDto, pfp: pfp?.filename });
  }

  @Delete(':id')
  delete(@Param('id') id: string): Observable<boolean> {
    return this.service.delete(id);
  }
}
