/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RatingEntity } from './entity/rating.entity';
import { Between, Like, Repository } from 'typeorm';

import { CreateRatingDto } from './dto/create.rating.dot';
import { UpdateRatingDto } from './dto/update.rating.dto';
import { JwtPayloadType } from 'src/utils/types';
import { UserRole } from 'src/utils/enum';
import { MovieService } from '../movie/movie.service';
import { UserService } from '../user/user.service';

@Injectable()
export class RatingService {
    constructor(@InjectRepository(RatingEntity) private ratingRepository: Repository<RatingEntity>,
        private movieService: MovieService,
        private userService: UserService,
    ) { }

    // Add your rating-related methods here
    public async create(movie_id: string, user_id: string, ratingData: CreateRatingDto): Promise<RatingEntity> {
        // Ensure the movie exists
        const movie = await this.movieService.findById(movie_id);
        if (!movie) {
            throw new NotFoundException('Movie not found');
        }

        // Ensure the user exists
        const user = await this.userService.findById(user_id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const existingRating = await this.ratingRepository.findOne({ where: { movie: { movie_id: movie_id }, user: { user_id: user_id } } });
        if (existingRating) {
            throw new NotFoundException('User has already rated this movie');
        }
        const newRating = this.ratingRepository.create(
            {
                ...ratingData,
                movie: movie,
                user: user,
            }
        );
        return await this.ratingRepository.save(newRating);
    }

    // update rating
    public async update(ratingId: string, userId: string, ratingData: UpdateRatingDto): Promise<RatingEntity> {

        const rating = await this.ratingRepository.findOne({ where: { rating_id: ratingId, user: { user_id: userId } } });
        if (!rating) {
            throw new NotFoundException('Rating not found');
        }
        Object.assign(rating, ratingData);
        return await this.ratingRepository.save(rating);
    }

    // delete rating
    public async delete(ratingId: string, payload: JwtPayloadType): Promise<void> {
        const rating = await this.ratingRepository.findOne({ where: { rating_id: ratingId } });
        if (!rating) {
            throw new NotFoundException('Rating not found');
        }
        if (rating.user.user_id === payload.userId || payload.role === UserRole.ADMIN) {
            await this.ratingRepository.remove(rating);
        } else {
            throw new NotFoundException('Unauthorized');
        }
    }

    // rating especial single movie 
    public async getRatingsByMovieId(movie_id: string): Promise<RatingEntity[]> {
        const ratings = await this.ratingRepository.find({
            where: { movie: { movie_id: movie_id } },
            // relations: ['user'], // Include user relation if needed
        });
        if (ratings.length == 0) {
            throw new NotFoundException('Ratings not found');
        }
        return ratings;
    }

    // get single movie by id 
    public async getRatingById(id: string): Promise<RatingEntity> {
        const rating = await this.ratingRepository.findOne({
            where: { rating_id: id },
            relations: ['user'], // Include user relation if needed
        });
        if (!rating) {
            throw new NotFoundException('Rating not found');
        }
        return rating;
    }

    // get all ratings
    public async getAllRatings(query): Promise<RatingEntity[]> {
        const filter ={
            ...(query?.user_id ? { user: { user_id: query.user_id } } : {}),
            ...(query?.movie_id ? { movie: { movie_id: query.movie_id } } : {}),
            ...(query?.rating ? { rating: query.rating } : {}),
            ...(query?.minrating && query?.maxrating ? { rating: Between(query.minrating, query.maxrating) } : {}),
            ...(query?.comment ? { comment: Like(`%${query.comment}%`) } : {}),
        }
        // Build order object with explicit direction types and cast for TypeORM
        const sort: { [key: string]: "ASC" | "DESC" } = (
            query?.sortBy
                ? { [query.sortBy]: query.sortOrder === 'DESC' ? 'DESC' : 'ASC' }
                : { rating_id: 'ASC' }
        );
        const ratings = await this.ratingRepository.find({
            where: filter,
            order: sort as any,
            relations: ['user' ,"movie"], // Include user and movie relations if needed
        });
        if (ratings.length == 0) {
            throw new NotFoundException('Ratings not found');
        }
        return ratings;
    }
}
