/* eslint-disable prettier/prettier */
import {
    Entity as Entity4,
    PrimaryGeneratedColumn as PrimaryGeneratedColumn4,
    Column as Column4,
    CreateDateColumn as CreateDateColumn4,
    UpdateDateColumn as UpdateDateColumn4,
    OneToMany,
} from 'typeorm';
import { ApiProperty as ApiProperty4 } from '@nestjs/swagger';
import { MoviePeopleEntity } from 'src/moduls/movie-people/entity/movie_people.entity';


/** PeopleEntity - persons involved in movies (actors, directors, etc.) */
@Entity4({ name: 'people' })
export class PeopleEntity {
    @ApiProperty4({ example: 'p1a2b3c4-....', description: 'Person UUID' })
    @PrimaryGeneratedColumn4('uuid')
    person_id: string;


    @ApiProperty4({ example: 'Christopher', description: 'First name' })
    @Column4({ type: 'varchar', length: 100 })
    first_name: string;


    @ApiProperty4({ example: 'Nolan', description: 'Last name' })
    @Column4({ type: 'varchar', length: 100 })
    last_name: string;

    @ApiProperty4({ example: 'cnolan', description: 'Username' })
    @Column4({ type: 'varchar', length: 50, unique: true })
    username : string;

    @ApiProperty4({ example: 'British-American film director...', description: 'Biography', required: false })
    @Column4({ type: 'text', nullable: true })
    bio?: string;


    @ApiProperty4({ example: '1970-07-30', description: 'Birth date', required: false })
    @Column4({ type: 'date', nullable: true })
    date_of_birth?: string;

    @ApiProperty4({ example: 'UK', description: 'Nationality', required: false })
    @Column4({ type: 'varchar', length: 100, nullable: true })
    nationality?: string;


    @ApiProperty4({ example: 'https://i.imgur.com/photo.png', description: 'Profile image URL', required: false })
    @Column4({ type: 'varchar', length: 500, nullable: true })
    photo_url?: string;

    @ApiProperty4({ example: '2025-10-01T00:00:00Z', description: 'Creation timestamp' })
    @CreateDateColumn4({ type: 'timestamp' })
    created_at: Date;


    @ApiProperty4({ example: '2025-10-02T00:00:00Z', description: 'Update timestamp' })
    @UpdateDateColumn4({ type: 'timestamp' })
    updated_at: Date;

    @ApiProperty4({ example: 'Movies associated with the person', description: 'Movies associated with the person' })
    @OneToMany(() => MoviePeopleEntity, (moviePeople) => moviePeople.person)
    moviepeople: MoviePeopleEntity[];
}