/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsDateString,
    Length,
} from 'class-validator';

export class CreatePeopleDto {
    @ApiProperty({
        example: 'Christopher',
        description: 'First name of the person',
    })
    @IsString({ message: 'First name must be a string' })
    @Length(1, 100, { message: 'First name must be between 1 and 100 characters' })
    first_name: string;

    @ApiProperty({
        example: 'Nolan',
        description: 'Last name of the person',
    })
    @IsString({ message: 'Last name must be a string' })
    @Length(1, 100, { message: 'Last name must be between 1 and 100 characters' })
    last_name: string;

    @ApiProperty({
        example: 'cnolan',
        description: 'Username',
    })
    @IsString({ message: 'Username must be a string' })
    @Length(1, 50, { message: 'Username must be between 1 and 50 characters' })
    username : string;
    
    @ApiPropertyOptional({
        example: 'British-American film director, producer, and screenwriter.',
        description: 'Biography of the person',
    })
    @IsOptional()
    @IsString({ message: 'Bio must be a string' })
    bio?: string;

    @ApiPropertyOptional({
        example: '1970-07-30',
        description: 'Birth date (ISO 8601 format: YYYY-MM-DD)',
    })
    @IsOptional()
    @IsDateString({}, { message: 'Date of birth must be a valid date string' })
    date_of_birth?: string;

    @ApiPropertyOptional({
        example: 'UK',
        description: 'Nationality of the person',
    })
    @IsOptional()
    @IsString({ message: 'Nationality must be a string' })
    @Length(1, 100, {
        message: 'Nationality must be between 1 and 100 characters',
    })
    nationality?: string;

    @ApiPropertyOptional({
        example: 'https://i.imgur.com/photo.png',
        description: 'Profile image URL of the person',
    })
    @IsOptional()
    @IsString({ message: 'Photo URL must be a string' })
    @Length(1, 500, {
        message: 'Photo URL must be between 1 and 500 characters',
    })
    photo_url?: string;
}
