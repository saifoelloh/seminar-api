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
import { Seminar } from './seminar.entity';
import { SeminarsService } from './seminars.service';

@Controller('seminars')
export class SeminarsController {
  constructor(readonly seminarService: SeminarsService) {}

  @Get()
  async findAndCount(
    @Query() queries: PaginationDto<Seminar>,
  ): Promise<Seminar[]> {
    const users = await this.seminarService.findAll(queries);
    return users;
  }

  @Get(':userId')
  async findOneById(@Param('userId') seminarId: string): Promise<Seminar> {
    const seminar = await this.seminarService.findOneBy({ id: seminarId });
    if (_.isEmpty(seminar)) {
      throw new NotFoundException('Please use valid userId');
    }

    return seminar;
  }
}
