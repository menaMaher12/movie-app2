/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MoviePeopleService } from './movie-people.service';

@Controller('movie-people')
export class MoviePeopleController {
    constructor(private readonly moviePeopleService: MoviePeopleService) {}
}
