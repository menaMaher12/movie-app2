/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserCouponDto } from './create-user-cupon.dto';

export class UpdateUserCouponDto extends PartialType(CreateUserCouponDto) {}