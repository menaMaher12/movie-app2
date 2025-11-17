/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { PeopleRole } from "../../../utils/enum";

export class CreateMoviePeopleDto {

    @ApiProperty({ enum: PeopleRole, description: 'Role of the person in the movie' })
    @IsEnum(PeopleRole, { message: 'role must be a valid PeopleRole enum value' })
    role: PeopleRole;
}