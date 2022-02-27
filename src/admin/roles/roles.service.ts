import { CreateRoleDto, UpdateRoleDto } from './models/roles.model';
import { UserRole, UserRoleDocument } from 'shared/models/userrole.shema';
import { from, map, Observable } from 'rxjs';
import { Role, RoleDocument } from './models/roles.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { selectQuery } from './roles.query';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private readonly model: Model<RoleDocument>,
    @InjectModel(UserRole.name) private readonly userRoleModel: Model<UserRoleDocument>,
  ) {}

  findAll(): Observable<Role[]> {
    const query = this.model.aggregate(selectQuery);

    return from(query.exec());
  }

  findById(id: string): Observable<Role> {
    const query = this.model.aggregate([
      { $match: { $expr: { $eq: ['$_id', { $toObjectId: id }] } } },
      { $project: { _id: 0 }},
      ...selectQuery,
    ]);

    return from(query.exec()).pipe(map(roleList => roleList[0] ?? null));
  }

  create(createRoleDto: CreateRoleDto ): Observable<Role> {
    const { users } = createRoleDto;
    const createdRole = new this.model(createRoleDto);

    if (users) {
      this.addUsers(createdRole._id, users);
    }

    return from(createdRole.save())
  }

  update(id: string, updateRoleDto: UpdateRoleDto): Observable<Role> {
    const { users } = updateRoleDto;
    const query = this.model.findByIdAndUpdate(
      id,
      { $set: { ...updateRoleDto, updatedTime: new Date() } },
      { new: true, projection: { __v: 0, isDeleted: 0 } },
    );

    if (users) {
      this.updateUsers(id, users);
    }

    return from(query.exec());
  }

  delete(id: string): Observable<boolean> {
    const query = this.model.findByIdAndRemove(id);

    this.userRoleModel.deleteMany({ role: id });

    return from(query.exec()).pipe(map(role => !role.isDeleted));
  }

  // ==========================
  // UTILS METHODS
  // ==========================
  private addUsers(id: string, users: string[]): void {
    this.userRoleModel.insertMany(
      users.map((user) => ({ user, role: id })),
    );
  }

  private updateUsers(id: string, users: string[]): void {
    this.userRoleModel.deleteMany({ role: id }, () =>
      this.addUsers(id, users),
    );
  }
}
