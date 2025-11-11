/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CURRENT_TIMESTAMP } from 'src/utils/constants';
import { SubscriptionType, UserRole } from 'src/utils/enum';

import { Exclude } from 'class-transformer';
import { RatingEntity } from 'src/moduls/rating/entity/rating.entity';
import { PaymentEntity } from 'src/moduls/payment/entity/payment.entity';
import { SubscriptionEntity } from 'src/moduls/subscription/entity/subscription.entity';
import { UserCouponsEntity } from 'src/moduls/user-coupon/entity/user_coupons.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @ApiProperty({
    example: 'd6a9b3e1-9f94-4b65-8c02-d34ad6a2f2c9',
    description: 'Unique identifier for the user (UUID)',
  })
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @ApiProperty({ example: 'Mina', description: 'First name of the user' })
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @ApiProperty({ example: 'Maher', description: 'Last name of the user' })
  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  // @ApiProperty({ example: 'mina123', description: 'Unique username for the user' })
  // @Column({ type: 'varchar', length: 50, unique: true })
  // username :string;

  @ApiProperty({ example: '+201112345678', description: 'Phone number', required: false })
  @Column({ type: 'varchar', length: 15, nullable: true })
  phone?: string;

  @ApiProperty({ example: 'mina@example.com', description: 'Unique email address' })
  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @ApiProperty({ example: 'StrongPass123!', description: 'Hashed user password' })
  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password: string;

  @ApiProperty({ example: 'https://i.imgur.com/avatar.png', description: 'Profile avatar', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true ,default :null })
  avatar?: string | null;

  @ApiProperty({
    enum: SubscriptionType,
    example: SubscriptionType.FREE,
    description: 'Type of subscription',
  })
  @Column({ type: 'enum', enum: SubscriptionType, default: SubscriptionType.FREE })
  subscriptionType: SubscriptionType;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
    description: 'Role of the user',
  })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  @Exclude()
  role: UserRole;

  @ApiProperty({ example: false, description: 'Indicates whether the user has verified their account' })
  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @ApiProperty({ example: 'verification-token-123', description: 'Token used for account verification', required: false })
  @Column({nullable :true ,default:null ,type :'varchar',length:255})
  verificationToken?: string | null;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => RatingEntity, (rating) => rating.user)
  ratings: RatingEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.user)
  payments: PaymentEntity[];

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.user)
  subscriptions: SubscriptionEntity[];

  @OneToMany(() => UserCouponsEntity, (userCoupon) => userCoupon.user)
  userCoupons: UserCouponsEntity[];
}
