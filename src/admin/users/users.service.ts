import { CreateUserDto, UpdateUserDto, UserDto } from '../../admin/users/models/user.model';
import { UserRole, UserRoleDocument } from 'shared/models/userrole.shema';
import { from, map, Observable, tap } from 'rxjs';
import { User, UserDocument } from './models/user.schema';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { selectQuery } from './users.query';
import { Injectable } from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { Model } from 'mongoose';
import { AppService } from 'src/app.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
    @InjectModel(UserRole.name)
    private readonly userRoleModel: Model<UserRoleDocument>,
    private readonly config: ConfigService,
    private readonly appService: AppService,
  ) {}

  findAll(): Observable<User[]> {
    const query = this.model.aggregate(selectQuery);

    return from(query.exec());
  }

  findOne(user: UserDto): Observable<User> {
    const { username } = user;

    if (username) {
      user.username = username.toLowerCase();
    }

    const query = this.model.aggregate([{ $match: user }, ...selectQuery]);

    return from(query.exec()).pipe(map((user) => user[0] ?? null));
  }

  findById(_id: string): Observable<User> {
    const query = this.model.aggregate([
      { $match: { $expr: { $eq: ['$_id', { $toObjectId: _id }] } } },
      { $project: { _id: 0 } },
      ...selectQuery,
    ]);

    return from(query.exec()).pipe(map((userList) => userList[0] ?? null));
  }

  create(createUserDto: CreateUserDto): Observable<User> {
    const { password, username, roles } = createUserDto;
    const saltOrRounds = Number(this.config.get<number>('SALT_OR_ROUNDS'));
    const createdUser = new this.model({
      ...createUserDto,
      username: username.toLowerCase(),
      password: hashSync(password, saltOrRounds),
    });

    if (roles) {
      this.addRoles(createdUser._id, roles);
    }

    return from(createdUser.save());
  }

  update(id: string, updateUserDto: UpdateUserDto): Observable<User> {
    const { password, username, roles, pfp } = updateUserDto;

    if (password) {
      const saltOrRounds = Number(this.config.get<number>('SALT_OR_ROUNDS'));

      updateUserDto.password = hashSync(password, saltOrRounds);
    }

    if (username) {
      updateUserDto.username = username.toLowerCase();
    }

    if (roles) {
      this.updateRoles(id, roles);
    }

    const query = this.model.findByIdAndUpdate(
      id,
      { $set: { ...updateUserDto, updatedTime: new Date() } },
      { new: true },
    );

    return from(query.exec()).pipe(
      tap((user) => {
        if (pfp && user.pfp !== pfp && user.pfp) {
          this.appService.removeUploadImage(user.pfp, 'PFPs');
        }
      }),
    );
  }

  delete(id: string): Observable<boolean> {
    const query = this.model.findByIdAndRemove(id);

    this.userRoleModel.deleteMany({ user: id });

    return from(query.exec()).pipe(
      tap((user) => {
        if (user.pfp) {
          this.appService.removeUploadImage(user.pfp, 'PFPs');
        }
      }),
      map((user) => !user.isDeleted),
    );
  }

  // ==========================
  // UTILS METHODS
  // ==========================
  private addRoles(id: string, roles: string[]): void {
    this.userRoleModel.insertMany(
      roles.map((category) => ({ user: id, role: category })),
    );
  }

  private updateRoles(id: string, roles: string[]): void {
    this.userRoleModel.deleteMany({ user: id }, () => this.addRoles(id, roles));
  }
}
