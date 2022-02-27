import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Authorize } from 'shared/decorators/Authorize.decorator';
import { Permissions } from 'src/auth/auth.permission';
import { CreateRoleDto, UpdateRoleDto } from './models/roles.model';
import { Role } from './models/roles.schema';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Get()
  @Authorize(Permissions.Pages_Roles_Read)
  findAll(): Observable<Role[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @Authorize(Permissions.Pages_Roles_Read)
  findById(@Param('id') id: string): Observable<Role> {
    return this.service.findById(id);
  }

  @Post()
  @Authorize(Permissions.Pages_Roles_Create)
  create(@Body() createRoleDto: CreateRoleDto): Observable<Role> {
    return this.service.create(createRoleDto);
  }

  @Put(':id')
  @Authorize(Permissions.Pages_Roles_Update)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Observable<Role> {
    return this.service.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Authorize(Permissions.Pages_Roles_Delete)
  delete(@Param('id') id: string): Observable<boolean> {
    return this.service.delete(id);
  }
}
