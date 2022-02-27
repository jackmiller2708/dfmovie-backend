import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Request } from 'express';
import { Public } from 'shared/decorators/PublicRoute.decorator';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@Req() { user }: Request) {
    return this.authService.login(user);
  }
}
