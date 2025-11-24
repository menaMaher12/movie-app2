/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from './entity/subscription.entity';
import { UserModule } from '../user/user.module';
import { SubscriptionPlanModule } from '../subscription-plan/subscription-plan.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { CouponModule } from '../coupon/coupon.module';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  imports: [TypeOrmModule.forFeature([SubscriptionEntity]),UserModule,SubscriptionPlanModule,ConfigModule ,JwtModule,MailModule,CouponModule],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
