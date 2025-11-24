/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';
import { PaymentEntity } from '../../payment/entity/payment.entity';
import { SubscriptionPlanEntity } from '../../../moduls/subscription-plan/entity/subscription-plan.entity';
import { CouponEntity } from '../../../moduls/coupon/entity/coupon.entity';

@Entity({ name: 'subscriptions' })
export class SubscriptionEntity {
  @ApiProperty({ example: 's1a2b3c4-....', description: 'Subscription UUID' })
  @PrimaryGeneratedColumn('uuid')
  subscription_id: string;

  @ApiProperty({ example: true, description: 'Indicates if the subscription is active' })
  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @ApiProperty({ example: '2025-10-01', description: 'Subscription start date', required: false })
  @Column({ type: 'date', nullable: true, default: null })
  start_date?: Date;

  @ApiProperty({ example: '2026-10-01', description: 'Subscription end date', required: false })
  @Column({ type: 'date', nullable: true, default: null })
  end_date?: Date;

  @ApiProperty({ example: '2025-10-01T00:00:00Z', description: 'Subscription creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'User associated with this subscription', type: () => UserEntity })
  @ManyToOne(() => UserEntity, (user) => user.subscriptions, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ApiProperty({ description: 'Plan associated with this subscription', type: () => SubscriptionPlanEntity })
  @ManyToOne(() => SubscriptionPlanEntity, (plan) => plan.subscriptions, { eager: true })
  @JoinColumn({ name: 'plan_id' })
  plan: SubscriptionPlanEntity;

  @ApiProperty({ description: 'Payments made for this subscription', type: () => [PaymentEntity], required: false })
  @OneToMany(() => PaymentEntity, (payment) => payment.subscription, { nullable: true })
  payments?: PaymentEntity[];

  @ApiProperty({ description: 'Coupon applied to this subscription', type: () => CouponEntity, required: false })
  @ManyToOne(() => CouponEntity, (coupon) => coupon.subscriptions, { nullable: true, eager: true })
  @JoinColumn({ name: 'coupon_id' })
  coupon?: CouponEntity;

  @ApiProperty({ example: 2.5, description: 'Amount discounted by coupon', required: false })
  @Column({ type: 'float', nullable: true, default: 0 })
  discount_amount?: number;

  @ApiProperty({ example: 7.49, description: 'Final subscription price after applying coupon' })
  @Column({ type: 'float' })
  final_price: number;
}
