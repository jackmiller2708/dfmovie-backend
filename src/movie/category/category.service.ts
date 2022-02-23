import { CreateCategoryDto, UpdateCategoryDto } from './models/category.model';
import { Category, CategoryDocument } from './models/category.schema';
import { from, map, Observable } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  get cateoryQuery(): any[] {
    return [
      { $project: { isDeleted: 0, __v: 0 } },
      {
        $lookup: {
          from: 'moviecategories',
          localField: '_id',
          foreignField: 'category',
          pipeline: [
            { $project: { _id: 0, __v: 0, category: 0 } },
            {
              $lookup: {
                from: 'movies',
                localField: 'movie',
                foreignField: '_id',
                pipeline: [{ $match: { isDeleted: false } }],
                as: 'movie',
              },
            },
            { $unwind: { path: '$movie' } },
            {
              $group: {
                _id: '$movie._id',
                name: { $first: '$movie.name' },
                translationKey: { $first: '$movie.translationKey' },
                createdTime: { $first: '$movie.createdTime' },
                updatedTime: { $first: '$movie.updatedTime' },
                poster: { $first: '$movie.poster' },
                description: { $first: '$movie.description' },
              },
            },
          ],
          as: 'movies',
        },
      },
    ];
  }
  constructor(
    @InjectModel(Category.name) private readonly model: Model<CategoryDocument>,
  ) {}

  findAll(): Observable<Category[]> {
    const query = this.model.aggregate<Category>([
      { $match: { isDeleted: false } },
      ...this.cateoryQuery
    ]);

    return from(query.exec());
  }

  findById(_id: string): Observable<Category> {
    const query = this.model.aggregate<Category>([
      {
        $match: {
          $expr: { $eq: ['$_id', { $toObjectId: _id }] },
          isDeleted: false,
        },
      },
      { $project: { _id: 0 } },
      ...this.cateoryQuery,
    ]);

    return from(query.exec()).pipe(
      map((categoryList) => categoryList[0] ?? null),
    );
  }

  create(createCategoryDto: CreateCategoryDto): Observable<Category> {
    const createdCategory = new this.model(createCategoryDto);

    return from(createdCategory.save());
  }

  update(_id: string, updateCategoryDto: UpdateCategoryDto, remove?: boolean): Observable<Category> {
    const query = this.model.findOneAndUpdate({ _id }, updateCategoryDto);

    return from(query.exec());
  }

  delete(_id: string): Observable<boolean> {
    const query = this.model.findByIdAndUpdate(
      { _id },
      { $set: { isDeleted: true } },
    );

    return from(query.exec()).pipe(map((category) => !category.isDeleted));
  }
}
