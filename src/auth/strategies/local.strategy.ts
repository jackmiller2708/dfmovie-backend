import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { NotAcceptableException } from "shared/httpExceptions";
import { UserDto } from "src/admin/users/models/user.model";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<UserDto> {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new NotAcceptableException('invalid username or password');
    }

    return user;
  }
}