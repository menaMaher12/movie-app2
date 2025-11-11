/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEnum,
    IsNumber,
    IsDateString,
    IsBoolean,
    IsOptional,
    Min,
} from 'class-validator';
import { SubscriptionType } from 'src/utils/enum';

/**
 * DTO for creating a new subscription.
 */
export class CreateSubscriptionDto {
    @ApiProperty({
        enum: SubscriptionType,
        example: SubscriptionType.BASIC,
        description: 'Type of subscription plan (e.g., BASIC, PREMIUM, VIP)',
    })
    @IsEnum(SubscriptionType, {
        message: `plan_name must be one of: ${Object.values(SubscriptionType).join(', ')}`,
    })
    plan_name: SubscriptionType;

    @ApiProperty({
        example: 9.99,
        description: 'Subscription price in USD',
    })
    @IsNumber({}, { message: 'price must be a number' })
    @Min(0, { message: 'price must be a positive number' })
    price: number;

    @ApiProperty({
        example: '2025-10-01',
        description: 'Subscription start date (YYYY-MM-DD)',
    })
    @IsDateString({}, { message: 'start_date must be a valid ISO date string' })
    start_date: string;

    @ApiPropertyOptional({
        example: '2026-10-01',
        description: 'Subscription end date (YYYY-MM-DD)',
    })
    @IsOptional()
    @IsDateString({}, { message: 'end_date must be a valid ISO date string' })
    end_date?: string;

    @ApiPropertyOptional({
        example: true,
        description: 'Indicates whether the subscription is active',
        default: true,
    })
    @IsOptional()
    @IsBoolean({ message: 'is_active must be a boolean value' })
    is_active?: boolean;
}
