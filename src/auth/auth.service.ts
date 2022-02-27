import { firstValueFrom } from 'rxjs';
import { UsersService } from 'src/admin/users/users.service';
import { compareSync } from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../admin/users/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<UserDto | null> {
    const user = await firstValueFrom(this.userService.findOne({ username }));

    if (user && compareSync(pass, user.password)) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login({username, _id}: UserDto) {
    const payload = { username, sub: String(_id) };

    return { access_token: this.jwtService.sign(payload) };
  }
}
