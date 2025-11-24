/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionEntity } from '../../../moduls/subscription/entity/subscription.entity';
import { UserCouponsEntity } from '../../../moduls/user-coupon/entity/user_coupons.entity';

/** CouponEntity - represents a discount coupon in the system */
@Entity({ name: 'coupons' })
export class CouponEntity {
  @ApiProperty({ example: 'c1a2b3c4-....', description: 'Coupon UUID' })
  @PrimaryGeneratedColumn('uuid')
  coupon_id: string;

  @ApiProperty({ example: 'WELCOME10', description: 'Coupon code (unique)' })
  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @ApiProperty({ example: '10% off for new users', description: 'Description', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @ApiProperty({ example: 10, description: 'Discount percentage (0-100)' })
  @Column({ type: 'int' })
  discount_percent: number;

  @ApiProperty({ example: '2025-10-01', description: 'Valid from date' })
  @Column({ type: 'date' })
  valid_from: Date;

  @ApiProperty({ example: '2026-10-01', description: 'Valid to date' })
  @Column({ type: 'date' })
  valid_to: Date;

  @ApiProperty({ example: true, description: 'Is active flag' })
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @ApiProperty({ example: 100, description: 'Maximum number of times this coupon can be used', required: false })
  @Column({ type: 'int', nullable: true })
  max_uses?: number;

  @ApiProperty({ example: 0, description: 'Current number of times the coupon has been used' })
  @Column({ type: 'int', default: 0 })
  use_count: number;

  @ApiProperty({ example: '2025-10-01T00:00:00Z', description: 'Creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Users who have used this coupon', type: () => [UserCouponsEntity], required: false })
  @OneToMany(() => UserCouponsEntity, (couponuser) => couponuser.coupon ,{ cascade: true ,onDelete:'CASCADE' , nullable:true})
  couponuser :UserCouponsEntity[];

  @ApiProperty({ description: 'Subscriptions that used this coupon', type: () => [SubscriptionEntity], required: false })
  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.coupon ,{ cascade: true ,onDelete:'CASCADE' , nullable:true})
  subscriptions: SubscriptionEntity[];
}
