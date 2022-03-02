import * as _ from 'lodash';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
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

  async findAll(
    paginationDto: PaginationDto<User>,
    options: FindManyOptions<User>,
  ): Promise<[User[], number]> {
    let page = 0,
      show = 5,
      sortBy = 'asc',
      orderBy = 'createdAt';
    if (!_.isEmpty(paginationDto)) {
      const temp = JSON.parse(paginationDto as any);
      page = temp.page;
      show = temp.show;
      orderBy = temp.orderBy;
      sortBy = temp.sortBy;
    }

    let option = {};
    if (!_.isEmpty(options)) {
      option = JSON.parse(options as string);
    }

    const users = await this.userRepository.findAndCount({
      skip: page * show,
      take: show,
      order: { [orderBy]: sortBy },
      relations: ['seminars'],
      ...option,
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
