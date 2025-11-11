/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserCouponController } from './user-coupon.controller';
import { UserCouponService } from './user-coupon.service';
import { UserCouponsEntity } from './entity/user_coupons.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { CouponModule } from '../coupon/coupon.module';

@Module({
  controllers: [UserCouponController],
  providers: [UserCouponService],
  imports: [TypeOrmModule.forFeature([UserCouponsEntity]), UserModule, CouponModule ,JwtModule],
})
export class UserCouponModule {}
