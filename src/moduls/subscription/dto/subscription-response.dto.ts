/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionType } from 'src/utils/enum';
import { PaymentEntity } from 'src/moduls/payment/entity/payment.entity';
import { UserEntity } from 'src/moduls/user/entities/user.entity';

/**
 * DTO for returning subscription details in API responses.
 */
export class SubscriptionResponseDto {
  @ApiProperty({ example: 's1a2b3c4-...', description: 'Subscription UUID' })
  subscription_id: string;

  @ApiProperty({
    enum: SubscriptionType,
    example: SubscriptionType.BASIC,
    description: 'Subscription plan name',
  })
  plan_name: SubscriptionType;

  @ApiProperty({ example: 9.99, description: 'Price in USD' })
  price: number;

  @ApiProperty({ example: '2025-10-01', description: 'Start date (YYYY-MM-DD)' })
  start_date: string;

  @ApiProperty({
    example: '2026-10-01',
    description: 'End date (YYYY-MM-DD)',
    required: false,
  })
  end_date?: string;

  @ApiProperty({ example: true, description: 'Is the subscription active?' })
  is_active: boolean;

  @ApiProperty({
    example: '2025-10-01T00:00:00Z',
    description: 'Creation timestamp (UTC)',
  })
  created_at: Date;

  @ApiProperty({
    type: () => UserEntity,
    description: 'User associated with this subscription',
  })
  user: UserEntity;

  @ApiProperty({
    type: () => [PaymentEntity],
    description: 'List of payments associated with this subscription',
  })
  payments: PaymentEntity[];
}
