/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoviePeopleEntity } from './entity/movie_people.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MoviePeopleService {
    constructor(@InjectRepository(MoviePeopleEntity) private readonly moviePeopleRepo: Repository<MoviePeopleEntity>) {}
}
