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
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';
import { Seminar } from './seminar.entity';
import { SeminarsService } from './seminars.service';
import { CreateSeminarDto } from './dto/create-seminar.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateSeminarDto } from './dto/update-seminar.dto';
import { JwtGuard } from 'src/users/jwt.guard';

@Controller('seminars')
export class SeminarsController {
  constructor(
    readonly seminarService: SeminarsService,
    readonly userService: UsersService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() body: CreateSeminarDto,
    @Req() req: any,
  ): Promise<Seminar> {
    const data = await this.seminarService.create(body, req.user);
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

  @UseGuards(JwtGuard)
  @Patch(':seminarId')
  async updateById(
    @Param('seminarId') seminarId: string,
    @Body() body: UpdateSeminarDto,
    @Req() req: any,
  ): Promise<void> {
    const user = await this.seminarService.findOneBy({ id: seminarId });
    if (_.isEmpty(user)) throw new NotFoundException('User not found');

    if (user.id !== req.user.id) throw new UnauthorizedException();

    await this.seminarService.updateBy({ id: seminarId }, body);
  }

  @UseGuards(JwtGuard)
  @Delete(':seminarId')
  async deleteById(@Param('seminarId') seminarId: string, @Req() req: any) {
    const seminar = await this.seminarService.findOneBy({ id: seminarId });
    if (_.isEmpty(seminar)) throw new NotFoundException('User not found');

    if (seminar.user.id !== req.user.id) throw new UnauthorizedException();

    await this.seminarService.deleteBy({ id: seminarId });
  }

  @UseGuards(JwtGuard)
  @Post(':seminarId/enroll')
  async enrollSeminar(@Param('seminarId') seminarId: string, @Req() req: any) {
    const seminar = await this.seminarService.findOneBy({ id: seminarId });
    if (_.isEmpty(seminar)) throw new NotFoundException('User not found');

    if (
      seminar.user.id === req.user.id &&
      seminar.attendance.length < seminar.quota
    )
      throw new UnauthorizedException();

    const result = await this.seminarService.enrollSeminar(seminar, req.user);
    return result;
  }
}
