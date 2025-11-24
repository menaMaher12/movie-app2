/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';
import { PaymentEntity } from '../../payment/entity/payment.entity';
import { SubscriptionPlanEntity } from '../../../moduls/subscription-plan/entity/subscription-plan.entity';
import { CouponEntity } from '../../../moduls/coupon/entity/coupon.entity';

export class SubscriptionResponseDto {
  @ApiProperty({ example: 's1a2b3c4-....', description: 'Subscription UUID' })
  subscription_id: string;

  @ApiProperty({ example: true, description: 'Indicates whether the subscription is active' })
  is_active: boolean;

  @ApiProperty({ example: '2025-10-01', description: 'Subscription start date', required: false })
  start_date?: Date;

  @ApiProperty({ example: '2026-10-01', description: 'Subscription end date', required: false })
  end_date?: Date;

  @ApiProperty({ example: '2025-10-01T00:00:00Z', description: 'Creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'User associated with this subscription', type: () => UserEntity })
  user: UserEntity;

  @ApiProperty({ description: 'Plan associated with this subscription', type: () => SubscriptionPlanEntity })
  plan: SubscriptionPlanEntity;

  @ApiProperty({ description: 'Payments associated with this subscription', type: () => [PaymentEntity], required: false })
  payments?: PaymentEntity[];

  @ApiProperty({ description: 'Coupon applied to this subscription', type: () => CouponEntity, required: false })
  coupon?: CouponEntity;

  @ApiProperty({ example: 2.5, description: 'Amount discounted by coupon', required: false })
  discount_amount?: number;

  @ApiProperty({ example: 7.49, description: 'Final subscription price after applying coupon' })
  final_price: number;
}
