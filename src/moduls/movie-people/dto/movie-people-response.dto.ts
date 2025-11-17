/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { PeopleRole } from '../../../utils/enum';
import { MovieEntity } from '../../../moduls/movie/entity/movie.entity';
import { PeopleEntity } from '../../../moduls/people/entity/people.entity';

/**
 * Response DTO for returning Movie-People relationship details.
 */
export class MoviePeopleResponseDto {

    @ApiProperty({
        enum: PeopleRole,
        example: PeopleRole.ACTOR,
        description: 'Role of the person in this movie',
    })
    role: PeopleRole;

    @ApiProperty({ type: () => MovieEntity, description: 'Movie details' })
    movie: MovieEntity;

    @ApiProperty({ type: () => PeopleEntity, description: 'Person details' })
    person: PeopleEntity;
}
