/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreatePeopleDto } from './create-people.dto';

/**
 * DTO for updating an existing person.
 * Extends CreatePeopleDto but makes all fields optional.
 */
export class UpdatePeopleDto extends PartialType(CreatePeopleDto) {
  // No additional validation needed — inherited from CreatePeopleDto
}
