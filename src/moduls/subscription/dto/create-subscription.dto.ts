/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString, Length, IsNotEmpty } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({
    example: 'f2a4d8e3-4c91-11ee-be56-0242ac120002',
    description: 'UUID of the subscription plan the user wants to subscribe to',
  })
  @IsUUID('4', { message: 'plan_id must be a valid UUID' })
  @IsNotEmpty({ message: 'plan_id is required' })
  plan_id: string;

  @ApiProperty({
    example: 'SAVE10',
    description: 'Coupon code to apply to this subscription (optional)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'coupon_code must be a string' })
  @Length(1, 50, { message: 'coupon_code length must be between 1 and 50 characters' })
  coupon_code?: string;
}
