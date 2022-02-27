import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { compareEncryptionText } from 'src/helpers/encryption';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Res() response: Response) {
    try {
      const user = await this.userService.findOneBy({ email: body.email });
      const isPasswordValid = await compareEncryptionText(
        body.password,
        user.password,
      );
      if (!isPasswordValid) return new UnauthorizedException();

      const token = this.authService.generateToken(user.id);
      response.cookie('Authorization', token);
      response.status(200).json({ user });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  @Post('logout')
  logout(@Res() response: Response) {
    response.clearCookie('Authorization');
    response.status(200).end();
  }
}
