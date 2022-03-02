import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Not, Repository } from 'typeorm';

import { User } from 'src/users/user.entity';
import { PaginationDto } from 'src/dto/pagination.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateSeminarDto } from './dto/create-seminar.dto';
import { SelectSeminarDto } from './dto/select-seminar.dto';
import { UpdateSeminarDto } from './dto/update-seminar.dto';
import { Seminar } from './seminar.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SeminarsService {
  constructor(
    @InjectRepository(Seminar)
    private seminarRepository: Repository<Seminar>,
    private userService: UsersService,
  ) {}

  async create(data: CreateSeminarDto, user: CreateUserDto): Promise<Seminar> {
    const result = await this.seminarRepository.save({
      ...data,
      user,
    });
    return result;
  }

  async findAll(
    paginationDto?: PaginationDto<Seminar>,
    options?: FindManyOptions<Seminar>,
    userId?: string,
  ): Promise<[Seminar[], number]> {
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

    let exclude = {};
    if (!_.isEmpty(userId)) {
      const currentUser = await this.userService.findOneBy(
        { id: userId },
        { relations: ['events'] },
      );
      const eventIds = currentUser.events.map((e) => e.id);
      exclude = {
        user: { id: Not(userId) },
        id: Not(In(eventIds)),
      };
    }

    const seminars = await this.seminarRepository.findAndCount({
      skip: page * show,
      take: show,
      order: { [orderBy]: sortBy },
      relations: ['user', 'attendance'],
      where: { ...option, ...exclude },
    });
    return seminars;
  }

  async findOneBy(conditions: SelectSeminarDto): Promise<Seminar> {
    const seminar = await this.seminarRepository.findOne({
      where: { ...conditions },
      relations: ['user', 'attendance'],
    });

    return seminar;
  }

  async updateBy(
    conditions: SelectSeminarDto,
    user: UpdateSeminarDto,
  ): Promise<void> {
    await this.seminarRepository.update({ ...conditions }, user);
  }

  async deleteBy(conditions: SelectSeminarDto): Promise<void> {
    await this.seminarRepository.delete({ ...conditions });
  }

  async enrollSeminar(seminar: Seminar, attendance: User) {
    seminar.attendance = [attendance];
    const result = await this.seminarRepository.save(seminar);
    return result;
  }
}
