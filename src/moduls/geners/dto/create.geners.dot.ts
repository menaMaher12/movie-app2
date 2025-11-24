/* eslint-disable prettier/prettier */

/**
 * [
  {
    "name": "Action",
    "description": "High energy scenes, fights, and intense moments"
  },
  {
    "name": "Romance",
    "description": "Stories centered around love and emotional relationships"
  },
  {
    "name": "Science Fiction",
    "description": "Futuristic concepts, advanced technology, and imaginative worlds"
  },
  {
    "name": "Comedy",
    "description": "Light-hearted stories designed to entertain and make viewers laugh"
  },
  {
    "name": "Horror",
    "description": "Scary and suspenseful content that aims to create fear"
  }
]
 */
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";

export class CreateGenreDto {
    @ApiProperty({ example: 'Action', description: 'The name of the genre', required: true })
    @Length(2, 50, {message: 'name must be between 2 and 50 characters long'})
    @IsString({message: 'name must be a string'})
    name: string;

    @ApiProperty({ example: 'High energy/action movies', description: 'A brief description of the genre', required: false })
    @Length(0, 255, {message: 'description can be up to 255 characters long'})
    @IsOptional()
    @IsString({message: 'description must be a string'})
    description?: string;
}