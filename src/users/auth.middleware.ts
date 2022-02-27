import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    readonly authService: AuthService,
    readonly userService: UsersService,
  ) {}
  async use(req: any, res: Response, next: NextFunction) {
    const token = req.cookies['Authorization'];
    const payload: any = this.authService.validateToken(token);
    const user = await this.userService.findOneBy({ id: payload.id });
    req.user = user;
    next();
  }
}
