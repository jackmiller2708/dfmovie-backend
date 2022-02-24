import { MovieCategory, MovieCategoryDocument } from 'shared/models/moviecateogy.schema';
import { CreateCategoryDto, UpdateCategoryDto } from './models/category.model';
import { Category, CategoryDocument } from './models/category.schema';
import { from, map, Observable } from 'rxjs';
import { selectQuery } from './category.query';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly model: Model<CategoryDocument>,
    @InjectModel(MovieCategory.name)
    private readonly movieCategoryModel: Model<MovieCategoryDocument>,
  ) {}

  findAll(): Observable<Category[]> {
    const query = this.model.aggregate(selectQuery);

    return from(query.exec());
  }

  findById(_id: string): Observable<Category> {
    const query = this.model.aggregate([
      { $match: { $expr: { $eq: ['$_id', { $toObjectId: _id }] } } },
      { $project: { _id: 0 }},
      ...selectQuery,
    ]);

    return from(query.exec()).pipe(
      map((categoryList) => categoryList[0] ?? null),
    );
  }

  create(createCategoryDto: CreateCategoryDto): Observable<Category> {
    const { movies, ...createData } = createCategoryDto;
    const createdCategory = new this.model(createData);

    if (movies) {
      this.addMovies(createdCategory._id, movies);
    }

    return from(createdCategory.save());
  }

  update(_id: string, updateCategoryDto: UpdateCategoryDto): Observable<Category> {
    const { movies, ...updateData } = updateCategoryDto;
    const query = this.model.findByIdAndUpdate(
      _id, {...updateData, updatedTime: new Date()}, { returnOriginal: false }
    );

    if (movies) {
      this.updateMovie(_id, movies);
    }

    return from(query.exec());
  }

  delete(_id: string): Observable<boolean> {
    const query = this.model.findByIdAndDelete(_id, {}, () => {
      this.movieCategoryModel.deleteMany({ category: _id });
    });

    return from(query.exec()).pipe(map((category) => !category.isDeleted));
  }

  // ==========================
  // UTILS METHODS
  // ==========================
  private addMovies(id: string, movies: string[]): void {
    this.movieCategoryModel.insertMany(
      movies.map((movie) => ({ movie , category: id })),
    );
  }

  private updateMovie(id: string, movies: string[]): void {
    this.movieCategoryModel.deleteMany({ category: id }, () =>
      this.addMovies(id, movies),
    );
  }
}
