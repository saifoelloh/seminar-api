import * as _ from 'lodash';
import { FindOneOptions, JoinOptions, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SelectUserDto } from './dto/select-user.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(data);
    const result = await this.userRepository.save(user);
    return result;
  }

  async findAll(paginationDto: PaginationDto<User>): Promise<User[]> {
    const {
      page = 0,
      show = 5,
      sortBy = 'asc',
      orderBy = 'createdAt',
    } = paginationDto;
    const users = await this.userRepository.find({
      skip: page * show,
      take: show,
      order: { [orderBy]: sortBy },
    });

    return users;
  }

  async findOneBy(
    conditions: SelectUserDto,
    findOneOptions?: FindOneOptions<User>,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { ...conditions },
      ...findOneOptions,
    });

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.findOneBy({ email });

    if (!user) throw new NotFoundException();

    return user;
  }

  async updateBy(
    conditions: SelectUserDto,
    user: UpdateUserDto,
  ): Promise<void> {
    await this.userRepository.update({ ...conditions }, user);
  }

  async deleteBy(conditions: SelectUserDto): Promise<void> {
    await this.userRepository.delete({ ...conditions });
  }
}
