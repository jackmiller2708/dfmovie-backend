import { Strategy, ExtractJwt } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string => {
          const { authorization } = req.headers;

          if (authorization) {
            const [scheme, token] = authorization.split(' ');

            return scheme === 'Bearer' && token ? token : '';
          }

          return '';
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_KEY'),
    });
  }

  async validate(payload: any) {
    const { sub, username, permissions } = payload;

    return { userId: sub, username, permissions };
  }
}