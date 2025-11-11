/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateRatingDto } from "./create.rating.dot";

/**
 * UpdateRatingDto class extends PartialType of CreateRatingDto
 * making all properties optional for update operations.
 */
export class UpdateRatingDto extends PartialType(CreateRatingDto) {}