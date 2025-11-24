/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, Max, IsBoolean, IsDateString } from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({ example: 'WELCOME10', description: 'Coupon code (unique)' })
  @IsString({ message: 'Coupon code must be a string' })
  code: string;

  @ApiProperty({ example: '10% off for new users', description: 'Description of the coupon', required: false })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({ example: 10, description: 'Discount percentage (0-100)' })
  @IsInt({ message: 'Discount percent must be an integer' })
  @Min(0, { message: 'Discount percent must be at least 0' })
  @Max(100, { message: 'Discount percent cannot exceed 100' })
  discount_percent: number;

  @ApiProperty({ example: '2025-10-01', description: 'Valid from date (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'valid_from must be a valid date string' })
  valid_from: Date;

  @ApiProperty({ example: '2026-10-01', description: 'Valid to date (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'valid_to must be a valid date string' })
  valid_to: Date;

  @ApiProperty({ example: true, description: 'Is the coupon active', required: false, default: true })
  @IsOptional()
  @IsBoolean({ message: 'is_active must be a boolean' })
  is_active?: boolean;

  @ApiProperty({ example: 100, description: 'Maximum number of times the coupon can be used', required: false })
  @IsOptional()
  @IsInt({ message: 'max_uses must be an integer' })
  max_uses?: number;
}
