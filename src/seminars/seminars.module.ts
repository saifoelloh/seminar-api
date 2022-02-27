import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/users/auth.middleware';
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
export class SeminarsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'seminars', method: RequestMethod.GET },
        { path: 'seminars/:seminarId', method: RequestMethod.GET },
      )
      .forRoutes(SeminarsController);
  }
}
