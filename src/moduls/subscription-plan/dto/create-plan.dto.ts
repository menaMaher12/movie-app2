/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, Min, Max, IsOptional, IsString, Length, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { SubscriptionType, StreamingQuality } from '../../../utils/enum';

export class CreateSubscriptionPlanDto {
  @ApiProperty({
    example: SubscriptionType.BASIC,
    description: 'Unique subscription plan name',
    enum: SubscriptionType,
  })
  @IsEnum(SubscriptionType, { message: 'Name must be a valid subscription type' })
  @IsNotEmpty({ message: 'Name is required' })
  name: SubscriptionType;

  @ApiProperty({ example: 9.99, description: 'Price of the plan' })
  @IsNumber({}, { message: 'Price must be a valid number' })
  @IsPositive({ message: 'Price must be greater than 0' })
  @Min(0.1, { message: 'Price must be at least 0.1' })
  @Max(10000, { message: 'Price must not exceed 10,000' })
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: 'USD', description: 'Currency code (ISO 4217)' })
  @IsString({ message: 'Currency must be a string' })
  @Length(3, 3, { message: 'Currency must be a valid 3-letter code' })
  currency: string;

  @ApiProperty({ example: 30, description: 'Number of days the subscription lasts' })
  @IsNumber({}, { message: 'Duration must be a valid number' })
  @IsPositive({ message: 'Duration must be greater than 0' })
  @Min(1, { message: 'Duration must be at least 1 day' })
  @Max(3650, { message: 'Duration must not exceed 10 years (3650 days)' })
  @Type(() => Number)
  duration_days: number;

  @ApiProperty({ example: 2, description: 'Maximum devices allowed' })
  @IsNumber({}, { message: 'max_devices must be a valid number' })
  @IsPositive({ message: 'max_devices must be greater than 0' })
  @Min(1)
  @Max(20)
  @Type(() => Number)
  max_devices: number;

  @ApiProperty({ example: StreamingQuality.HD, description: 'Video streaming quality', enum: StreamingQuality })
  @IsEnum(StreamingQuality, { message: 'Quality must be valid' })
  video_quality: StreamingQuality;

  @ApiProperty({ example: 'Basic monthly plan', description: 'Optional plan description', required: false })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @Length(0, 255)
  description?: string;

  @ApiProperty({ example: true, description: 'Is plan active?', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
