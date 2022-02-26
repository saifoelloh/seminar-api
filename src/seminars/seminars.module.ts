import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

import { Seminar } from './seminar.entity';
import { SeminarsController } from './seminars.controller';
import { SeminarsService } from './seminars.service';

@Module({
  imports: [TypeOrmModule.forFeature([Seminar]), UsersModule],
  exports: [TypeOrmModule, SeminarsService],
  controllers: [SeminarsController],
  providers: [SeminarsService],
})
export class SeminarsModule {}
