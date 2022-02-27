import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../../admin/users/models/user.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { Permissions } from 'src/auth/auth.permission';
import { Observable } from 'rxjs';
import { Authorize } from 'shared/decorators/Authorize.decorator';
import { User } from './models/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @Authorize(Permissions.Pages_Users_Read)
  findAll(): Observable<User[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @Authorize(Permissions.Pages_Users_Read)
  findById(@Param('id') id: string) {
    this.service.findById(id);
  }

  @Post()
  @Authorize(Permissions.Pages_Users_Create)
  @UseInterceptors(FileInterceptor('pfp'))
  create(@UploadedFile() pfp: Express.Multer.File, @Body() createUserDto: CreateUserDto): Observable<User> {
    return this.service.create({ ...createUserDto, pfp: pfp?.filename });
  }

  @Put(':id')
  @Authorize(Permissions.Pages_Users_Update)
  @UseInterceptors(FileInterceptor('pfp'))
  update(@Param('id') id: string, @UploadedFile() pfp: Express.Multer.File, @Body() updateUserDto: UpdateUserDto): Observable<User> {
    return this.service.update(id, { ...updateUserDto, pfp: pfp?.filename });
  }

  @Delete(':id')
  @Authorize(Permissions.Pages_Users_Delete)
  delete(@Param('id') id: string): Observable<boolean> {
    return this.service.delete(id);
  }
}
