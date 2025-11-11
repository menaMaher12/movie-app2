/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PeopleEntity } from './entity/people.entity';
import { Repository } from 'typeorm';
import { PeopleResponseDto } from './dto/people-response.dto';
import { CreatePeopleDto } from './dto/create-people.dto';
import { UpdatePeopleDto } from './dto/update-people.dto';
import { PeopleQuery } from 'src/interface/people-interface-query';

@Injectable()
export class PeopleService {
    constructor(
        @InjectRepository(PeopleEntity)
        private readonly peopleRepository: Repository<PeopleEntity>,
    ) { }

    /**
     * Create a new person record.
     * @param createPeopleDto Data for the new person
     */
    public async createPerson(createPeopleDto: CreatePeopleDto): Promise<PeopleResponseDto> {
        // Check if username is already used
        const existing = await this.peopleRepository.findOne({
            where: { username: createPeopleDto.username },
        });

        if (existing) {
            throw new ConflictException(`Person with username "${createPeopleDto.username}" already exists.`);
        }

        const newPerson = this.peopleRepository.create(createPeopleDto);
        const savedPerson = await this.peopleRepository.save(newPerson);
        return savedPerson as PeopleResponseDto;
    }

    public async findAll(query: PeopleQuery): Promise<{ data: PeopleResponseDto[]; total: number; page: number; limit: number }> {
        const {
            first_name,
            last_name,
            username,
            nationality,
            sortBy = 'created_at',
            sortOrder = 'DESC',
            page = 1,
            limit = 10,
        } = query;

        const skip = (page - 1) * limit;

        // Build the query using QueryBuilder
        const qb = this.peopleRepository.createQueryBuilder('people')
            .leftJoinAndSelect('people.moviepeople', 'movie_people');

        // Filtering
        if (first_name) qb.andWhere('people.first_name ILIKE :first_name', { first_name: `%${first_name}%` });
        if (last_name) qb.andWhere('people.last_name ILIKE :last_name', { last_name: `%${last_name}%` });
        if (username) qb.andWhere('people.username ILIKE :username', { username: `%${username}%` });
        if (nationality) qb.andWhere('people.nationality ILIKE :nationality', { nationality: `%${nationality}%` });

        // Sorting
        qb.orderBy(`people.${sortBy}`, sortOrder);

        // Pagination
        qb.skip(skip).take(limit);

        // Execute query
        const [data, total] = await qb.getManyAndCount();

        return { data: data as PeopleResponseDto[], total, page, limit };
    }
    /**
     * Find a person by ID.
     * @param person_id UUID of the person
     * @throws NotFoundException if person is not found
     */
    public async findOneById(person_id: string): Promise<PeopleResponseDto> {
        const person = await this.peopleRepository.findOne({
            where: { person_id },
            relations: ['movie_people'],
        });

        if (!person) {
            throw new NotFoundException(`Person with ID "${person_id}" not found.`);
        }

        return person as PeopleResponseDto;
    }

    /**
     * Find a person by username.
     * @param username The username of the person to find.
     * @throws NotFoundException if no person with the given username is found.
     */
    public async findByUsername(username: string): Promise<PeopleResponseDto> {
        const person = await this.peopleRepository.findOne({
            where: { username },
            relations: ['movie_people'],
        });

        if (!person) {
            throw new NotFoundException(`Person with username "${username}" not found.`);
        }

        return person as PeopleResponseDto;
    }

    /**
     * Update a person's information.
     * @param person_id UUID of the person to update
     * @param updatePeopleDto Fields to update
     * @throws NotFoundException if person is not found
     */
    public async updatePersonById(
        person_id: string,
        updatePeopleDto: UpdatePeopleDto,
    ): Promise<PeopleResponseDto> {
        const person = await this.findOneById(person_id);
        if (!person) {
            throw new NotFoundException(`Person with ID "${person_id}" not found.`);
        }
        const updated = Object.assign(person, updatePeopleDto);
        const saved = await this.peopleRepository.save(updated);
        return saved as PeopleResponseDto;
    }
     /**
     * Update a person's information.
     * @param person_id UUID of the person to update
     * @param updatePeopleDto Fields to update
     * @throws NotFoundException if person is not found
     */
    public async updatePersonByUsername(
        username: string,
        updatePeopleDto: UpdatePeopleDto,
    ): Promise<PeopleResponseDto> {
        const person = await this.findByUsername(username);
        if (!person) {
            throw new NotFoundException(`Person with username "${username}" not found.`);
        }
        const updated = Object.assign(person, updatePeopleDto);
        const saved = await this.peopleRepository.save(updated);
        return saved as PeopleResponseDto;
    }

    /**
     * Delete a person from the database.
     * @param person_id UUID of the person to delete
     * @throws NotFoundException if person does not exist
     */
    public async deletePerson(person_id: string): Promise<{ message: string }> {
        const person = await this.findOneById(person_id);
        if (!person) {
            throw new NotFoundException(`Person with ID "${person_id}" not found.`);
        }
        await this.peopleRepository.remove(person);
        return { message: `Person with ID "${person_id}" has been deleted successfully.` };
    }
}
