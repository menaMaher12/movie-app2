/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionDto } from './create-subscription.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

/**
 * DTO for updating subscription details.
 * All fields are optional.
 */
export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {
    @ApiPropertyOptional({
        example: true,
        description: 'Indicates whether the subscription is active',
        default: true,
    })
    @IsOptional()
    @IsBoolean({ message: 'is_active must be a boolean value' })
    is_active?: boolean;
}
