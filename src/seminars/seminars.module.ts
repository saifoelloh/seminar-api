import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Seminar } from './seminar.entity';
import { SeminarsController } from './seminars.controller';
import { SeminarsService } from './seminars.service';

@Module({
  imports: [TypeOrmModule.forFeature([Seminar]), User, UsersService],
  exports: [TypeOrmModule, SeminarsService],
  controllers: [SeminarsController],
  providers: [SeminarsService],
})
export class SeminarsModule {}
