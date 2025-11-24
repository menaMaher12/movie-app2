/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionPlanEntity } from './entity/subscription-plan.entity';
import { Repository } from 'typeorm';
import { SubscriptionPlanResponseDto } from './dto/plan-response.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-plan.dto';
import { CreateSubscriptionPlanDto } from './dto/create-plan.dto';
import { SubscriptionType } from '../../utils/enum';

export type queryType = {
    page: string,
    limit?: string,
    maxPrice?: string,
    minPrice?: string,
    maxDurationDays?: string,
    minDurationDays?: string,
    name?: string,
    duration?: string,
    is_active?: boolean | string,
    duration_days?: string,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC',
}

@Injectable()
export class SubscriptionPlanService {
    constructor(
        @InjectRepository(SubscriptionPlanEntity)
        private readonly subscriptionPlanRepository: Repository<SubscriptionPlanEntity>,
    ) { }

    /**
     * Retrieves all subscription plans with filtering, sorting and pagination.
     *
     * @async
     * @param {queryType} query - Query filters like sorting, price range, duration, pagination, etc.
     * @returns {Promise<{data: SubscriptionPlanResponseDto[], total: number}>}
     * A paginated list of subscription plans and the total count.
     *
     * @throws {ForbiddenException} If no plans match the provided criteria.
     */
    async findAll(query: queryType): Promise<{ data: SubscriptionPlanResponseDto[], total: number }> {
        const {
            page = 1,
            limit = 10,
            minPrice,
            maxPrice,
            is_active,
            minDurationDays,
            maxDurationDays,
            name,
            sortBy = "createdAt",
            sortOrder = "ASC",
        } = query;

        const planQB = this.subscriptionPlanRepository.createQueryBuilder('plan');

        // Filtering
        if (name) planQB.andWhere('plan.name LIKE :name', { name: `%${name}%` });

        if (typeof is_active !== 'undefined') {
            const active = is_active === 'true' || is_active === true;
            planQB.andWhere('plan.is_active = :active', { active });
        }

        if (minPrice) planQB.andWhere('plan.price >= :minPrice', { parsedMinPrice: parseFloat(minPrice) });

        if (maxPrice) planQB.andWhere('plan.price <= :maxPrice', { parsedMaxPrice: parseFloat(maxPrice) });

        if (maxDurationDays) planQB.andWhere('plan.duration_days <= :maxDurationDays', { parsedMaxDurationDays: parseInt(maxDurationDays) });

        if (minDurationDays) planQB.andWhere('plan.duration_days >= :minDurationDays', { parsedMinDurationDays: parseInt(minDurationDays) });

        // Sorting
        const allowedSortFields = ['plan_id', 'name', 'price', 'duration_days', 'is_active', 'created_at', 'updated_at'];
        const orderByField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
        const orderDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        planQB.orderBy(`plan.${orderByField}`, orderDirection);

        // Pagination
        const take = Math.max(1, Number(limit));
        const skip = (Number(page) - 1) * take;
        planQB.skip(skip).take(take);

        const [data, total] = await planQB.getManyAndCount();

        if (data.length === 0) {
            throw new ForbiddenException('No subscription plans found with the given criteria.');
        }

        return { data, total };
    }

    /**
     * Retrieve a subscription plan by ID.
     *
     * @async
     * @param {string} planId - ID of the subscription plan.
     * @returns {Promise<SubscriptionPlanResponseDto>}
     * The requested plan details.
     *
     * @throws {NotFoundException} If the plan does not exist.
     */
    public async findById(planId: string): Promise<SubscriptionPlanResponseDto> {
        const plan = await this.getById(planId);
        return plan;
    }

    /**
     * Create a new subscription plan.
     *
     * @async
     * @param {CreateSubscriptionPlanDto} planData - Subscription plan details.
     * @returns {Promise<SubscriptionPlanResponseDto>}
     * The created subscription plan.
     *
     * @throws {ForbiddenException} If a plan with the same name already exists.
     */
    async createPlan(planData: CreateSubscriptionPlanDto): Promise<SubscriptionPlanResponseDto> {
        const isExists = await this.isPlanNameExists(planData.name);
        if (isExists) {
            throw new ForbiddenException('Subscription plan with this name already exists.');
        }
        const newPlan = this.subscriptionPlanRepository.create(planData);
        await this.subscriptionPlanRepository.save(newPlan);
        return newPlan;
    }

    /**
     * Update the active status of a subscription plan.
     *
     * @async
     * @param {string} planId - ID of the subscription plan.
     * @param {boolean} isActive - New active state.
     * @returns {Promise<SubscriptionPlanResponseDto>}
     * Updated subscription plan.
     */
    async updateStatus(planId: string, isActive: boolean): Promise<SubscriptionPlanResponseDto> {
        const plan = await this.getById(planId);
        plan.is_active = isActive;
        await this.subscriptionPlanRepository.save(plan);
        return plan;
    }

    /**
     * Update an existing subscription plan.
     *
     * @async
     * @param {string} planId - ID of the plan to update.
     * @param {UpdateSubscriptionPlanDto} updateData - New plan data.
     * @returns {Promise<SubscriptionPlanResponseDto>}
     * Updated plan details.
     *
     * @throws {NotFoundException} If plan does not exist.
     */
    async updatePlan(planId: string, updateData: UpdateSubscriptionPlanDto): Promise<SubscriptionPlanResponseDto> {
        const plan = await this.getById(planId);
        Object.assign(plan, updateData);
        await this.subscriptionPlanRepository.save(plan);
        return plan;
    }

    /**
     * Delete a subscription plan.
     *
     * @async
     * @param {string} planId - ID of the subscription plan.
     * @returns {Promise<string>}
     * Success message confirming deletion.
     *
     * @throws {NotFoundException} If plan is not found.
     */
    async deletePlan(planId: string): Promise<string> {
        const plan = await this.getById(planId);
        await this.subscriptionPlanRepository.remove(plan);
        return 'Subscription plan deleted successfully.';
    }

    /**
     * Find subscription plan by name.
     *
     * @async
     * @param {string} name - Plan name.
     * @returns {Promise<SubscriptionPlanResponseDto>}
     * Subscription plan details.
     *
     * @throws {NotFoundException} If the plan does not exist.
     */
    async findByName(name: SubscriptionType): Promise<SubscriptionPlanResponseDto> {
        const plan = await this.subscriptionPlanRepository.findOne({ where: { name } });
        if (!plan) {
            throw new NotFoundException('Subscription plan not found.');
        }
        return plan;
    }

    /**
     * Fetch all active subscription plans.
     *
     * @async
     * @param {number} [page=1] - Page number.
     * @param {number} [limit=10] - Items per page.
     * @returns {Promise<SubscriptionPlanResponseDto[]>}
     * List of active subscription plans.
     */
    async findAllActivePlans(page: number = 1, limit: number = 10): Promise<{ plans: SubscriptionPlanResponseDto[]; total: number }> {
        const [plans,total] = await this.subscriptionPlanRepository.findAndCount({ where: { is_active: true }, skip: (page - 1) * limit, take: limit });
        return { plans, total  };   
    }

    /**
     * Internal helper: Fetch plan by ID and ensure existence.
     *
     * @private
     * @async
     * @param {string} planId - Plan ID.
     * @returns {Promise<SubscriptionPlanEntity>}
     * The subscription plan entity.
     *
     * @throws {NotFoundException} If plan isn't found.
     */
    private async getById(planId: string): Promise<SubscriptionPlanEntity> {
        const plan = await this.subscriptionPlanRepository.findOne({ where: { plan_id: planId } });
        if (!plan) {
            throw new NotFoundException('Subscription plan not found.');
        }
        return plan;
    }

    /**
     * Internal helper: Checks if a subscription plan name already exists.
     *
     * @private
     * @async
     * @param {string} name - Subscription plan name.
     * @returns {Promise<boolean>}
     * True if a plan exists with the given name.
     */
    private async isPlanNameExists(name: SubscriptionType): Promise<boolean> {
        const plan = await this.subscriptionPlanRepository.findOne({ where: { name } });
        return !!plan;
    }

}
