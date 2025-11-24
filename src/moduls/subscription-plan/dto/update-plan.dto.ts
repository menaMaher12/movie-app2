/* eslint-disable prettier/prettier */
import { CreateSubscriptionPlanDto } from "./create-plan.dto";
import { PartialType } from "@nestjs/swagger";

/**
 * DTO for updating subscription plan details.
 * All fields are optional.
 */
export class UpdateSubscriptionPlanDto extends PartialType(CreateSubscriptionPlanDto) {}