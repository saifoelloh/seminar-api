import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SeminarsModule } from './seminars/seminars.module';
import { User } from './users/user.entity';
import { Seminar } from './seminars/seminar.entity';
import { AuthModule } from './auth/auth.module';
import database from './config/database';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      entities: [User, Seminar],
      ...database,
    }),
    UsersModule,
    SeminarsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
