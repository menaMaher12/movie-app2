/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Length, Max, Min } from "class-validator";

/**
 * Data Transfer Object for creating a new rating.
 * Includes validation rules and Swagger documentation.
 */
export class CreateRatingDto {
    @ApiProperty({ example: 4, description: 'Rating value between 1 and 5' })
    @IsNumber({}, { message: 'Rating must be a number' })
    @Min(1, { message: 'Rating must be at least 1' })
    @Max(5, { message: 'Rating must be at most 5' })
    rating: number;

    @ApiProperty({ example: 'Amazing movie with stunning visuals!', description: 'Optional comment about the movie', required: false })
    @IsOptional()
    @IsString({ message: 'Comment must be a string' })
    @Length(0, 500, { message: 'Comment can be at most 500 characters long' })
    comment?: string;
}