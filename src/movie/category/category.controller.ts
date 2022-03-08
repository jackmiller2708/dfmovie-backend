import { CreateCategoryDto, UpdateCategoryDto } from './models/category.model';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { NotAcceptableException } from 'shared/httpExceptions';
import { CategoryService } from './category.service';
import { Observable } from 'rxjs';
import { Category } from './models/category.schema';
import { Public } from 'shared/decorators/PublicRoute.decorator';
import { Authorize } from 'shared/decorators/Authorize.decorator';
import { Permissions } from 'src/auth/auth.permission';

@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get()
  @Public()
  findAll(): Observable<Category[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @Public()
  findById(@Param('id') id: string): Observable<Category> {
    return this.service.findById(id);
  }

  @Post()
  @Authorize(Permissions.Pages_Categories_Create)
  create(@Body() createCategoryDto: CreateCategoryDto):Promise<Observable<Category>> {
    return this.service.create(createCategoryDto);
  }

  @Put(':id')
  @Authorize(Permissions.Pages_Categories_Update)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Observable<Category>> {
    return this.service.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Authorize(Permissions.Pages_Categories_Delete)
  delete(@Param('id') id: string): Observable<boolean> {
    return this.service.delete(id);
  }
}
