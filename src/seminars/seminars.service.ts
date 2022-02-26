import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/dto/pagination.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Repository } from 'typeorm';
import { CreateSeminarDto } from './dto/create-seminar.dto';
import { SelectSeminarDto } from './dto/select-seminar.dto';
import { UpdateSeminarDto } from './dto/update-seminar.dto';
import { Seminar } from './seminar.entity';

@Injectable()
export class SeminarsService {
  constructor(
    @InjectRepository(Seminar)
    private seminarRepository: Repository<Seminar>,
  ) {}

  async create(data: CreateSeminarDto, user: CreateUserDto): Promise<Seminar> {
    const result = await this.seminarRepository.save({
      ...data,
      user,
    });
    return result;
  }

  async findAll(paginationDto: PaginationDto<Seminar>): Promise<Seminar[]> {
    const {
      page = 0,
      show = 5,
      sortBy = 'asc',
      orderBy = 'createdAt',
    } = paginationDto;
    const users = await this.seminarRepository.find({
      skip: page * show,
      take: show,
      order: { [orderBy]: sortBy },
      relations: ['user'],
    });

    return users;
  }

  async findOneBy(conditions: SelectSeminarDto): Promise<Seminar> {
    const seminar = await this.seminarRepository.findOne({
      where: { ...conditions },
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
}
