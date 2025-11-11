/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MoviePeopleController } from './movie-people.controller';
import {MoviePeopleService} from "./movie-people.service"
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviePeopleEntity } from './entity/movie_people.entity';
@Module({
  controllers: [MoviePeopleController],
  providers: [MoviePeopleService],
  imports: [TypeOrmModule.forFeature([MoviePeopleEntity])],
})
export class MoviePeopleModule {}
