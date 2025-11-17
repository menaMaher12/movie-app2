/* eslint-disable prettier/prettier */
import {
    Entity as Entity9,
    Column as Column9,
    PrimaryColumn as PrimaryColumn9,
    ManyToOne as ManyToOne9,
} from 'typeorm';
import { ApiProperty as ApiProperty9 } from '@nestjs/swagger';
import { PeopleRole as PeopleRole9 } from '../../../utils/enum';
import { JoinColumn as JoinColumn9 } from 'typeorm';
import { MovieEntity } from '../../../moduls/movie/entity/movie.entity';
import { PeopleEntity } from '../../../moduls/people/entity/people.entity';

/**
* MoviePeople - junction table for Movie <-> People with role attribute
*/
@Entity9({ name: 'movie_people' })
export class MoviePeopleEntity {
    @ApiProperty9({ example: 'movie-uuid', description: 'Movie UUID (FK)' })
    @PrimaryColumn9({ type: 'uuid' })
    movie_id: string;


    @ApiProperty9({ example: 'person-uuid', description: 'Person UUID (FK)' })
    @PrimaryColumn9({ type: 'uuid' })
    person_id: string;


    @ApiProperty9({ enum: PeopleRole9, example: PeopleRole9.ACTOR, description: 'Role of person in the movie' })
    @Column9({ type: 'enum', enum: PeopleRole9 , default: PeopleRole9.ACTOR })
    role: PeopleRole9;

    @ApiProperty9({ description: 'Movie associated with the person' })
    @ManyToOne9(() => MovieEntity, { onDelete: 'CASCADE' })
    @JoinColumn9({ name: 'movie_id' })
    movie: MovieEntity;

    @ApiProperty9({ description: 'Person associated with the movie' })
    @ManyToOne9(() => PeopleEntity, { onDelete: 'CASCADE' })
    @JoinColumn9({ name: 'person_id' })
    person: PeopleEntity;
}