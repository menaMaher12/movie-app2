/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './create-payment.dto';

/**
 * DTO for updating a payment record.
 * All fields are optional.
 */
export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
