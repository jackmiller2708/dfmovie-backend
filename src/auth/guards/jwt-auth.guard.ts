import { ExecutionContext, Injectable } from '@nestjs/common';
import { UnauthorizedException } from 'shared/httpExceptions';
import { IS_PUBLIC_KEY } from 'shared/decorators/PublicRoute.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return isPublic || super.canActivate(context);
  }

  handleRequest(err: Error, user: any, info: Record<string, any>) {
    if (err || !user) {
      throw err || new UnauthorizedException(`${info.name}: ${info.message}`);
    }

    return user;
  }
}
