/* eslint-disable prettier/prettier */
import { PartialType } from "@nestjs/mapped-types";
import { CreateMoviePeopleDto } from "./create-movie-people.dto";

export class UpdateMoviePeopleDto extends PartialType(CreateMoviePeopleDto) {}