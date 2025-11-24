/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { RatingService } from './rating.service';

import { UserRole } from '../../utils/enum';
import type { JwtPayloadType } from '../../utils/types';
import { CreateRatingDto } from './dto/create.rating.dot';
import { ApiParam, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { UpdateRatingDto } from './dto/update.rating.dto';
import { RatingListResponse, RatingSingleResponse } from '../../interface/rating.interface';
import { Role } from '../../common/decrators/user-role/user-role.decorator';
import { AuthRoleGuard } from '../../common/guards/role_guard/auth.role.guard';
import { CurrentUser } from '../../common/decrators/currentuser/currentuser.decorator';
@Controller('rating')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class RatingController {
    // Controller methods will be implemented here
    constructor(private readonly ratingService: RatingService) {}

    // Create a new rating
    /**
     * Create a new rating for a movie by a user
     * @param movie_id movie id
     * @param ratingData rating data
     * @param payload user payload
     * @returns created rating
     */
    @ApiProperty({ description: 'The created rating' })
    @ApiParam({ name: 'movie_id', type: String, description: 'ID of the movie to rate' })
    @ApiParam({ name: 'ratingData', type: CreateRatingDto, description: 'Data for the new rating' })
    @ApiResponse({
        status: 201,
        description: 'Rating created successfully',
        type: ()=> RatingSingleResponse,
    })
    @Post(":movie_id")
    @Role(UserRole.USER)
    @UseGuards(AuthRoleGuard)
    async createRating(
        @Param('movie_id') movie_id: string,
        @Body() ratingData: CreateRatingDto,
        @CurrentUser() payload: JwtPayloadType
    ): Promise<RatingSingleResponse> {
        const user_id = payload.userId; // Get user ID from the JWT payload
        const rating = await this.ratingService.create(movie_id, user_id, ratingData);
        return {
            success: true,
            message: 'Rating created successfully',
            data: rating,
        };
    }

    // update rating 
    @Patch(":rating_id")
    @Role(UserRole.USER)
    @UseGuards(AuthRoleGuard)
    async updateRating(
        @Param('rating_id') rating_id: string,
        @Body() ratingData: UpdateRatingDto,
        @CurrentUser() payload: JwtPayloadType
    ): Promise<RatingSingleResponse> {
        const rating = await this.ratingService.update(rating_id,payload.userId, ratingData);
        return {
            success: true,
            message: 'Rating updated successfully',
            data: rating,
        };
    }

    // Delete rating
    @Delete(":rating_id")
    @Role(UserRole.USER ,UserRole.ADMIN)
    @UseGuards(AuthRoleGuard)
    async deleteRating(
        @Param('rating_id') rating_id: string,
        @CurrentUser() payload: JwtPayloadType
    ): Promise<{ success: boolean; message: string }> {
        await this.ratingService.delete(rating_id, payload);
        return {
            success: true,
            message: 'Rating deleted successfully',
        };
    }

    // rating especial sing movie 
    @Get("movie/:movie_id")
    async getRatings(@Param('movie_id') movie_id: string ): Promise<RatingListResponse> {
        const ratings = await this.ratingService.getRatingsByMovieId(movie_id);
        return {
            success: true,
            message: 'Ratings retrieved successfully',
            total: ratings.length,
            pages: 1,
            data: ratings,
        };
    }

    // Get a single rating by ID
    @Get(":rating_id")
    async getRatingById(
        @Param('rating_id') rating_id: string
    ): Promise<RatingSingleResponse> {
        const rating = await this.ratingService.getRatingById(rating_id);
        return {
            success: true,
            message: 'Rating retrieved successfully',
            data: rating,
        };
    }

    // get all ratings
    @Get()
    @Role(UserRole.ADMIN)
    @UseGuards(AuthRoleGuard)
    async getAllRatings(@Query() query:any): Promise<RatingListResponse> {
        const data = await this.ratingService.getAllRatings(query);
        return {
            success: true,
            message: 'Ratings retrieved successfully',
            data: data.ratings,
            total: data.total,
            pages: data.pages,
        };
    }

    // @Get(":movie_id/:rating_id")
    // async getRatingById(
    //     @Param('movie_id') movie_id: string,
    //     @Param('rating_id') rating_id: string
    // ): Promise<{ success: boolean; data: RatingEntity }> {
    //     const rating = await this.ratingService.findById(movie_id, rating_id);
    //     return {
    //         success: true,
    //         data: rating,
    //     };
    // }
}
