/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionEntity } from '../../../moduls/subscription/entity/subscription.entity';
import { SubscriptionType, StreamingQuality } from '../../../utils/enum';

@Entity({ name: 'subscription_plans' })
export class SubscriptionPlanEntity {
  @ApiProperty({ example: 'f2a4d8e3-4c91-11ee-be56-0242ac120002' })
  @PrimaryGeneratedColumn('uuid')
  plan_id: string;

  @ApiProperty({
    example: SubscriptionType.BASIC,
    description: 'Plan unique name (enum: BASIC, STANDARD, PREMIUM, etc.)',
    enum: SubscriptionType,
  })
  @Column({ type: 'enum', enum: SubscriptionType, unique: true })
  name: SubscriptionType;

  @ApiProperty({
    example: 9.99,
    description: 'Plan price',
  })
  @Column({ type: 'float' })
  price: number;

  @ApiProperty({
    example: 'USD',
    description: 'Currency of the plan price (ISO 4217)',
  })
  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @ApiProperty({
    example: 30,
    description: 'Duration of the plan in days',
  })
  @Column({ type: 'int' })
  duration_days: number;

  @ApiProperty({
    example: 1,
    description: 'Maximum number of devices allowed simultaneously',
  })
  @Column({ type: 'int', default: 1 })
  max_devices: number;

  @ApiProperty({
    example: StreamingQuality.HD,
    description: 'Video streaming quality (SD, HD, FULL_HD, UHD, 4K, etc.)',
    enum: StreamingQuality,
  })
  @Column({ type: 'varchar', length: 20, default: 'HD' })
  video_quality: StreamingQuality;

  @ApiProperty({
    example: 'Basic monthly plan with limited features',
    description: 'Optional plan description',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the plan is currently active',
  })
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @ApiProperty({
    example: '2025-02-10T10:12:45.000Z',
    description: 'Timestamp when the plan was created',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    example: '2025-02-15T08:20:11.000Z',
    description: 'Timestamp when the plan was last updated',
  })
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.plan, { nullable: true })
  subscriptions?: SubscriptionEntity[];
}
