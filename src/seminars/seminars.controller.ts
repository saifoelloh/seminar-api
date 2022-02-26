import * as _ from 'lodash';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';
import { Seminar } from './seminar.entity';
import { SeminarsService } from './seminars.service';
import { CreateSeminarDto } from './dto/create-seminar.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateSeminarDto } from './dto/update-seminar.dto';

@Controller('seminars')
export class SeminarsController {
  constructor(
    readonly seminarService: SeminarsService,
    readonly userService: UsersService,
  ) {}

  @Post()
  async create(@Body() body: CreateSeminarDto): Promise<Seminar> {
    const user = await this.userService.findOneBy({ id: body.userId });
    if (_.isEmpty(user)) {
      throw new NotFoundException();
    }

    const data = await this.seminarService.create(body, user);
    return data;
  }

  @Get()
  async findAndCount(
    @Query() queries: PaginationDto<Seminar>,
  ): Promise<Seminar[]> {
    const users = await this.seminarService.findAll(queries);
    return users;
  }

  @Get(':seminarId')
  async findOneById(@Param('seminarId') seminarId: string): Promise<Seminar> {
    const seminar = await this.seminarService.findOneBy({ id: seminarId });
    if (_.isEmpty(seminar)) {
      throw new NotFoundException('Please use valid seminarId');
    }

    return seminar;
  }

  @Patch(':userId')
  async updateById(
    @Param('userId') seminarId: string,
    @Body() body: UpdateSeminarDto,
  ): Promise<void> {
    const user = await this.seminarService.findOneBy({ id: seminarId });
    if (_.isEmpty(user)) {
      throw new NotFoundException('User not found');
    }

    await this.seminarService.updateBy({ id: seminarId }, body);
  }

  @Delete(':seminarId')
  async deleteById(@Param('seminarId') seminarId: string) {
    const seminar = await this.seminarService.findOneBy({ id: seminarId });
    if (_.isEmpty(seminar)) {
      throw new NotFoundException('User not found');
    }

    await this.seminarService.deleteBy({ id: seminarId });
  }
}
