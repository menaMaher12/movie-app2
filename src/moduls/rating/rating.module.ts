/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingEntity } from './entity/rating.entity';

import { JwtModule } from '@nestjs/jwt';
import { MovieModule } from '../movie/movie.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [RatingController],
  providers: [RatingService],
  imports: [TypeOrmModule.forFeature([RatingEntity]), MovieModule, UserModule,JwtModule],
})
export class RatingModule {}
