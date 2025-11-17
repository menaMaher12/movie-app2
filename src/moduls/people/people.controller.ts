/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
    NotFoundException,
    Patch,
} from '@nestjs/common';
import { Role } from '../../common/decrators/user-role/user-role.decorator';
import { AuthRoleGuard } from '../../common/guards/role_guard/auth.role.guard';
import { PeopleService } from './people.service';
import { UserRole } from '../../utils/enum';
import { CreatePeopleDto } from './dto/create-people.dto';
import { UpdatePeopleDto } from './dto/update-people.dto';
import { PeopleResponseDto } from './dto/people-response.dto';
import * as peopleInterfaceQuery from '../../interface/people-interface-query';

@Controller('api/v1/people')
@UseGuards(AuthRoleGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class PeopleController {
    constructor(private readonly peopleService: PeopleService) { }

    /**
     * Create a new person.
     */
    @Post()
    @Role(UserRole.ADMIN)
    async createPerson(
        @Body() createPeopleDto: CreatePeopleDto,
    ): Promise<{ success: boolean; message: string; data: PeopleResponseDto }> {
        const newPerson = await this.peopleService.createPerson(createPeopleDto);
        return {
            success: true,
            message: 'Person created successfully',
            data: newPerson,
        };
    }

    /**
     * Get all people with filtering, sorting, and pagination.
     */
    @Get()
    @Role(UserRole.ADMIN)
    async getAllPeople(
        @Query() query: peopleInterfaceQuery.PeopleQuery,
    ): Promise<{ success: boolean; message: string; data: PeopleResponseDto[]; total: number; pages: number }> {
        const { data, total, limit } = await this.peopleService.findAll(query);
        return {
            success: true,
            message: 'People fetched successfully',
            data,
            total,
            pages: Math.ceil(total / (limit || 10)),
        };
    }

    /**
     * Get a single person by username.
     */
    @Get(':username')
    @Role(UserRole.ADMIN)
    async getPersonByUsername(
        @Param('username') username: string,
    ): Promise<{ success: boolean; message: string; data: PeopleResponseDto }> {
        const person = await this.peopleService.findByUsername(username);
        if (!person) {
            throw new NotFoundException(`Person with username ${username} not found`);
        }
        return {
            success: true,
            message: 'Person fetched successfully',
            data: person,
        };
    }

    /**
    * Get a single person by username.
    */
    @Get('person/:person_id')
    @Role(UserRole.ADMIN)
    async getPersonById(
        @Param('person_id') person_id: string,
    ): Promise<{ success: boolean; message: string; data: PeopleResponseDto }> {
        const person = await this.peopleService.findOneById(person_id);
        if (!person) {
            throw new NotFoundException(`Person with ID ${person_id} not found`);
        }
        return {
            success: true,
            message: 'Person fetched successfully',
            data: person,
        };
    }
    /**
     * Update a person by username.
     */
    @Patch(':username')
    @Role(UserRole.ADMIN)
    async updatePerson(
        @Param('username') username: string,
        @Body() updateDto: UpdatePeopleDto,
    ): Promise<{ success: boolean; message: string; data: PeopleResponseDto }> {
        const updatedPerson = await this.peopleService.updatePersonByUsername(username, updateDto);
        return {
            success: true,
            message: 'Person updated successfully',
            data: updatedPerson,
        };
    }

    /**
     * Update a person by person by id .
     */
    @Patch('person/:person_id')
    @Role(UserRole.ADMIN)
    async updatePersonById(
        @Param('person_id') person_id: string,
        @Body() updateDto: UpdatePeopleDto,
    ): Promise<{ success: boolean; message: string; data: PeopleResponseDto }> {
        const updatedPerson = await this.peopleService.updatePersonById(person_id, updateDto);
        return {
            success: true,
            message: 'Person updated successfully',
            data: updatedPerson,
        };
    }
}
