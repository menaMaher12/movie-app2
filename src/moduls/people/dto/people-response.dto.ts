/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { MoviePeopleEntity } from 'src/moduls/movie-people/entity/movie_people.entity';

/**
 * DTO used for API responses when returning person details.
 */
export class PeopleResponseDto {
    @ApiProperty({
        example: 'p1a2b3c4-d5e6-789f-gh12-ijk345lm678n',
        description: 'Unique identifier (UUID) of the person',
    })
    person_id: string;

    @ApiProperty({ example: 'Christopher', description: 'First name' })
    first_name: string;

    @ApiProperty({ example: 'Nolan', description: 'Last name' })
    last_name: string;

    @ApiProperty({ example: 'cnolan', description: 'Username' })
    username: string;

    @ApiProperty({
        example: 'British-American film director, producer, and screenwriter.',
        description: 'Biography of the person',
        required: false,
    })
    bio?: string;

    @ApiProperty({
        example: '1970-07-30',
        description: 'Date of birth (YYYY-MM-DD)',
        required: false,
    })
    date_of_birth?: string;

    @ApiProperty({ example: 'UK', description: 'Nationality', required: false })
    nationality?: string;

    @ApiProperty({
        example: 'https://i.imgur.com/photo.png',
        description: 'Profile image URL',
        required: false,
    })
    photo_url?: string;

    @ApiProperty({
        example: '2025-10-01T00:00:00Z',
        description: 'Record creation timestamp (UTC)',
    })
    created_at: Date;

    @ApiProperty({
        example: '2025-10-02T00:00:00Z',
        description: 'Record update timestamp (UTC)',
    })
    updated_at: Date;

    @ApiProperty({
        description: 'Movies associated with this person',
        type: () => [MoviePeopleEntity],
    })
    moviepeople: MoviePeopleEntity[];
}
