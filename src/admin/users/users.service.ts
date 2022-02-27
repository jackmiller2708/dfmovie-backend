import { CreateUserDto, UpdateUserDto, UserDto } from '../../admin/users/models/user.model';
import { from, map, Observable } from 'rxjs';
import { User, UserDocument } from './models/user.schema';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
    private readonly config: ConfigService,
  ) {}

  findAll(): Observable<User[]> {
    const query = this.model.find();;

    return from(query.exec());
  }

  findOne(user: UserDto): Observable<User> {
    const {username} = user;

    if (username) {
      user.username = username.toLowerCase();
    }

    const query = this.model.aggregate([{ $match: user }])

    return from(query.exec()).pipe(map(user => user[0] ?? null));
  }

  findById(_id: string): Observable<User> {
    const query = this.model.findById(_id);

    return from(query.exec());
  }

  create(createUserDto: CreateUserDto): Observable<User> {
    const  { password, username } = createUserDto;
    const saltOrRounds = Number(this.config.get<number>('SALT_OR_ROUNDS'));
    const createdUser = new this.model({
      ...createUserDto,
      username: username.toLowerCase(),
      password: hashSync(password, saltOrRounds),
    });

    return from(createdUser.save());
  }

  update(id: string, updateUserDto: UpdateUserDto): Observable<User> {
    const  { password, username } = updateUserDto;

    if (password) {
      const saltOrRounds = Number(this.config.get<number>('SALT_OR_ROUNDS'));

      updateUserDto.password = hashSync(password, saltOrRounds);
    }

    if (username) {
      updateUserDto.username = username.toLowerCase();
    }

    const query = this.model.findByIdAndUpdate(id, { $set: updateUserDto }, { returnOriginal: false });

    return from(query.exec());
  }

  delete(id: string): Observable<boolean> {
    const query = this.model.findByIdAndRemove(id);

    return from(query.exec()).pipe(map((user) => !user.isDeleted));
  }
}