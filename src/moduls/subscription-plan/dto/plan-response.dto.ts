/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionType, StreamingQuality } from '../../../utils/enum';

export class SubscriptionPlanResponseDto {
  @ApiProperty({ example: 'f2a4d8e3-4c91-11ee-be56-0242ac120002', description: 'Plan UUID' })
  plan_id: string;

  @ApiProperty({ example: SubscriptionType.BASIC, description: 'Plan name', enum: SubscriptionType })
  name: SubscriptionType;

  @ApiProperty({ example: 9.99, description: 'Plan price' })
  price: number;

  @ApiProperty({ example: 'USD', description: 'Currency of the plan price' })
  currency: string;

  @ApiProperty({ example: 30, description: 'Duration in days' })
  duration_days: number;

  @ApiProperty({ example: 2, description: 'Maximum devices allowed' })
  max_devices: number;

  @ApiProperty({ example: StreamingQuality.HD, description: 'Video quality', enum: StreamingQuality })
  video_quality: StreamingQuality;

  @ApiProperty({ example: 'Basic monthly plan', description: 'Optional plan description', required: false })
  description?: string;

  @ApiProperty({ example: true, description: 'Is plan active?' })
  is_active: boolean;

  @ApiProperty({ example: '2025-02-10T10:12:45.000Z', description: 'Creation timestamp' })
  created_at: Date;

  @ApiProperty({ example: '2025-02-15T08:20:11.000Z', description: 'Last update timestamp' })
  updated_at: Date;
}
