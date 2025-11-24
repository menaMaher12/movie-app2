/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { CouponEntity } from './entity/coupon.entity';
import { SubscriptionEntity } from '../subscription/entity/subscription.entity';
import { CreateCouponDto } from './dto/create.coupon.dot';
import { CouponResponseDto } from './dto/response.coupon.dto';
import { UpdateCouponDto } from './dto/update.coupon.dto';

@Injectable()
export class CouponService {
    constructor(
        @InjectRepository(CouponEntity)
        private readonly couponRepo: Repository<CouponEntity>,
    ) { }

    /**
     * Create a new coupon
     * @param dto CreateCouponDto
     * @returns created CouponEntity
     * @throws BadRequestException if coupon code already exists or discount_percent invalid
     */
    async createCoupon(dto: CreateCouponDto): Promise<CouponEntity> {
        await this._checkDuplicateCode(dto.code);
        this._validateDiscountPercent(dto.discount_percent);

        const coupon = this.couponRepo.create(dto);
        return await this.couponRepo.save(coupon);
    }

    /**
    * Get all coupons with filter, sort and pagination
    * @param options object
    *   - page?: number (default 1)
    *   - limit?: number (default 10)
    *   - search?: string (filter by code or description)
    *   - is_active?: boolean
    *   - sortBy?: string ('code', 'discount_percent', 'valid_from', 'valid_to', 'created_at')
    *   - order?: 'ASC' | 'DESC' (default 'ASC')
    * @returns { data: CouponEntity[], total: number, page: number, limit: number }
    */
    async getAllCoupons(options: {
        page?: number;
        limit?: number;
        search?: string;
        is_active?: boolean;
        sortBy?: string;
        sortOrder?: 'ASC' | 'DESC';
    }): Promise<{
        data: CouponResponseDto[];
        total: number;
        pages: number;
    }> {
        const page = options.page || 1;
        const limit = options.limit || 10;
        const skip = (page - 1) * limit;
        const sortBy = options.sortBy || 'created_at';
        const sortOrder = options.sortOrder || 'ASC';
        console.log('Options:', options);
        const qb = this.couponRepo.createQueryBuilder('coupon')
            .leftJoinAndSelect('coupon.subscriptions', 'subscription')
            .leftJoinAndSelect('subscription.user', 'user');

        if (options.search) {
            qb.andWhere('(coupon.code LIKE :search OR coupon.description LIKE :search)', {
                search: `%${options.search}%`,
            });
        }

        if (options.is_active !== undefined) {
            qb.andWhere('coupon.is_active = :is_active', { is_active: options.is_active });
        }

        qb.orderBy(`coupon.${sortBy}`, sortOrder)
            .skip(skip)
            .take(limit);

        const [data, total] = await qb.getManyAndCount();

        return {
            data,
            total,
            pages: Math.ceil(total / limit)
        };
    }

    /**
     * Get a single coupon by id or code
     * @param idOrCode string coupon_id or code
     * @returns CouponEntity
     * @throws NotFoundException if coupon not found
     */
    async getCoupon(idOrCode: string): Promise<CouponEntity> {
        const coupon = await this.couponRepo.findOne({
            where: [{ coupon_id: idOrCode }, { code: idOrCode }],
            relations: ['subscriptions', 'subscriptions.user'],
        });

        if (!coupon) throw new NotFoundException('Coupon not found');
        return coupon;
    }

    /**
     * Update a coupon
     * @param couponId string
     * @param dto UpdateCouponDto
     * @returns updated CouponEntity
     * @throws NotFoundException if coupon not found
     * @throws BadRequestException if trying to set invalid discount_percent or duplicate code
     */
    async updateCoupon(couponId: string, dto: UpdateCouponDto): Promise<CouponEntity> {
        const coupon = await this.getCoupon(couponId);

        if (dto.code && dto.code !== coupon.code) {
            await this._checkDuplicateCode(dto.code);
        }

        if (dto.discount_percent !== undefined) {
            this._validateDiscountPercent(dto.discount_percent);
        }

        Object.assign(coupon, dto);
        return await this.couponRepo.save(coupon);
    }

    /**
     * Delete a coupon by id
     * @param couponId string
     * @returns void
     * @throws NotFoundException if coupon not found
     */
    async deleteCoupon(couponId: string): Promise<string> {
        const coupon = await this.getCoupon(couponId);
        await this.couponRepo.remove(coupon);
        return "Coupon is deleted successfully.";
    }

    /**
     * Check if a coupon is valid and can be applied
     * @param code string
     * @returns CouponEntity
     * @throws BadRequestException if coupon is invalid, inactive, expired or exceeded max usage
     */
    async validateCoupon(code: string): Promise<CouponEntity> {
        const coupon = await this.couponRepo.findOne({
            where: {
                code,
                is_active: true,
                valid_from: LessThanOrEqual(new Date()),
                valid_to: MoreThanOrEqual(new Date()),
            },
            relations: ['subscriptions', 'subscriptions.user'],
        });

        if (!coupon) throw new BadRequestException('Invalid or expired coupon');
        this._checkMaxUses(coupon);
        return coupon;
    }

    /**
     * Increment coupon use count after successful subscription/payment
     * @param couponId string
     * @returns updated CouponEntity
     * @throws NotFoundException if coupon not found
     * @throws BadRequestException if coupon already reached max usage
     */
    async incrementUseCount(couponId: string): Promise<CouponEntity> {
        const coupon = await this.getCoupon(couponId);
        this._checkMaxUses(coupon);

        coupon.use_count += 1;
        return await this.couponRepo.save(coupon);
    }

    /**
     * Get all users who used a coupon
     * @param couponId string
     * @returns array of UserEntity
     * @throws NotFoundException if coupon not found
     */
    async getUsersByCoupon(couponId: string) {
        const coupon = await this.getCoupon(couponId);
        return coupon.subscriptions.map((sub: SubscriptionEntity) => sub.user);
    }

    // ----------------------- Private Helpers -----------------------

    /**
     * Check if coupon code already exists
     * @param code string
     * @throws BadRequestException if duplicate
     */
    private async _checkDuplicateCode(code: string) {
        const exists = await this.couponRepo.findOne({ where: { code } });
        if (exists) throw new BadRequestException('Coupon code already exists');
    }

    /**
     * Validate discount percent (0-100)
     * @param percent number
     * @throws BadRequestException if invalid
     */
    private _validateDiscountPercent(percent: number) {
        if (percent < 0 || percent > 100) {
            throw new BadRequestException('Discount percent must be between 0 and 100');
        }
    }

    /**
     * Check if coupon exceeded max usage
     * @param coupon CouponEntity
     * @throws BadRequestException if exceeded
     */
    private _checkMaxUses(coupon: CouponEntity) {
        if (coupon.max_uses !== null && coupon.max_uses !== undefined) {
            if (coupon.use_count >= coupon.max_uses) {
                throw new BadRequestException('Coupon has reached maximum usage');
            }
        }
    }
}
