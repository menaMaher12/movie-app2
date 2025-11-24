/* eslint-disable prettier/prettier */
import { CreateCouponDto } from "./create.coupon.dot";
import { PartialType } from "@nestjs/swagger";
export class UpdateCouponDto extends PartialType(CreateCouponDto) {}