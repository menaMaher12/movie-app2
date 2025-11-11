/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionDto } from './create-subscription.dto';

/**
 * DTO for updating subscription details.
 * All fields are optional.
 */
export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {}
