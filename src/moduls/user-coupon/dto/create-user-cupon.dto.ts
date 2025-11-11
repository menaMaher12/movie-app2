/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";
/**
 * CreateUserCouponDto - Data Transfer Object for creating a user coupon
 * Includes validation and Swagger documentation
 */
export class CreateUserCouponDto {
    @ApiProperty({ example: true, description: 'Whether the coupon is still valid for user', required: true })
    @IsBoolean({message: 'is_valid must be a boolean value'})
    @IsOptional()
    is_valid ?: boolean;

    @ApiProperty({ example: 'DISCOUNT2024', description: 'The code of the coupon to be used', required: true })
    @IsString({message: 'coupon_code must be a string'})
    coupon_code : string
}