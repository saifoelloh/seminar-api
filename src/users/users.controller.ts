import * as _ from 'lodash';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { encryptString } from 'src/helpers/encryption';

@Controller('users')
export class UsersController {
  constructor(readonly userService: UsersService) {}

  @Post()
  async create(@Body() body: CreateUserDto): Promise<User> {
    const { name, email, password } = body;
    const user = await this.userService.findOneBy({ email });
    if (!_.isEmpty(user)) {
      throw new NotAcceptableException('Email is Already Registered');
    }

    const data = await this.userService.create({ name, email, password });
    return data;
  }

  @Get()
  async findAndCount(@Query() queries: PaginationDto<User>): Promise<User[]> {
    const users = await this.userService.findAll(queries);
    return users;
  }

  @Get(':userId')
  async findOneById(@Param('userId') userId: string): Promise<User> {
    const user = await this.userService.findOneBy({ id: userId });
    if (_.isEmpty(user)) {
      throw new NotFoundException('Please use valid userId');
    }

    return user;
  }

  @Patch(':userId')
  async updateById(
    @Param('userId') userId: string,
    @Body() body: UpdateUserDto,
  ): Promise<void> {
    const user = await this.userService.findOneBy({ id: userId });
    if (_.isEmpty(user)) {
      throw new NotFoundException('User not found');
    }

    const { password: plainPassword, ...data } = body;
    const password = await encryptString(plainPassword);
    await this.userService.updateBy({ id: userId }, { ...data, password });
  }

  @Delete(':userId')
  async deleteById(@Param('userId') userId: string) {
    const user = await this.userService.findOneBy({ id: userId });
    if (_.isEmpty(user)) {
      throw new NotFoundException('User not found');
    }

    await this.userService.deleteBy({ id: userId });
  }
}
