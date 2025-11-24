/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionEntity } from '../../../moduls/subscription/entity/subscription.entity';

export class CouponResponseDto {
  @ApiProperty({ example: 'c1a2b3c4-....', description: 'Coupon UUID' })
  coupon_id: string;

  @ApiProperty({ example: 'WELCOME10', description: 'Coupon code' })
  code: string;

  @ApiProperty({ example: '10% off for new users', description: 'Description', required: false })
  description?: string;

  @ApiProperty({ example: 10, description: 'Discount percentage' })
  discount_percent: number;

  @ApiProperty({ example: '2025-10-01', description: 'Valid from date' })
  valid_from: Date;

  @ApiProperty({ example: '2026-10-01', description: 'Valid to date' })
  valid_to: Date;

  @ApiProperty({ example: true, description: 'Is coupon active' })
  is_active: boolean;

  @ApiProperty({ example: 100, description: 'Maximum uses allowed', required: false })
  max_uses?: number;

  @ApiProperty({ example: 0, description: 'Current number of times the coupon has been used' })
  use_count: number;

  @ApiProperty({ example: '2025-10-01T00:00:00Z', description: 'Creation timestamp' })
  created_at: Date;

  @ApiProperty({ type: () => [SubscriptionEntity], description: 'List of subscriptions that used this coupon', required: false })
  subscriptions?: SubscriptionEntity[];
}
