/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayloadType } from 'src/utils/types';
import { UserRole } from 'src/utils/enum';
import { AuthProvider } from './auth.provider';
import { join } from 'node:path';
import { unlinkSync } from 'node:fs';
@Injectable()
export class UserService {

  constructor(@InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>, private readonly authProvider: AuthProvider) { }

  // Register or Signup User
  public async register(user: CreateUserDto): Promise<{ userId: string; email: string, role: string }> {
    return await this.authProvider.register(user);
  }

  public async login(email: string, password: string): Promise<{ userId: string; email: string; role: string }> {
    return await this.authProvider.login(email, password);
  }

  // Create User
  public async create(user: CreateUserDto) {
    const newUser = this.userRepo.create(user);
    return await this.userRepo.save(newUser);
  }

  // Get All Users
  public async findAll(query: any): Promise<UserEntity[]> {
    const filters: any = {
      ...(query?.firstname ? { firstName: query.firstname } : {}),
      ...(query?.lastname ? { lastName: query.lastname } : {}),
      ...(query?.email ? { email: Like(`%${query.email}%`) } : {}),
      ...(query?.role ? { role: query.role } : {}),
      ...(query?.isVerified !== undefined ? { isVerified: query.isVerified } : {}),
      ...(query?.subscriptionType !== undefined ? { subscriptionType: query.subscriptionType } : {}),

    };
    const sort: any = {
      ...(query?.sortBy ? { [query.sortBy]: query.sortOrder === 'DESC' ? 'DESC' : 'ASC' } : { user_id: 'ASC' }),
    }
    const skipPage: number | undefined = query?.page && query?.limit ? (query.page - 1) * query.limit : undefined;
    const numUserPerPage: number | undefined = query?.limit ? query.limit : undefined;
    const users = await this.userRepo.find({
      where: filters,
      order: sort,
      skip: skipPage,
      take: numUserPerPage,
    });
    return users;
  }

  // Get One User by ID
  public async findById(user_id: string): Promise<UserEntity> {
    const user = await this.userRepo.findOne({ where: { user_id } })
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    return user;
  }

  // Update User by ID
  public async update(user_id: string, updateData: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findById(user_id);
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    Object.assign(user, updateData);
    return await this.userRepo.save(user);
  }

  //  Delete User by ID
  public async remove(user_id: string, payload: JwtPayloadType): Promise<string> {

    if (payload.role !== UserRole.ADMIN && String(payload.userId) !== user_id) {
      throw new NotFoundException(`You do not have permission to delete this user`);
    }
    const user = await this.findById(user_id);

    await this.userRepo.remove(user);
    return `User ${user_id} deleted successfully`;
  }

  //  Verify User (Optional helper)
  async verifyUser(id: string): Promise<UserEntity> {
    const user = await this.findById(id);
    user.isVerified = true;
    return await this.userRepo.save(user);
  }

  /** Get User by Email (Optional helper) */
  public async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  /**
   * getCurrentUser
   * @description Additional methods related to user management can be added here
   * @param user_id number
   * @returns UserEntity
   */

  public async getCurrentUser(user_id: string): Promise<UserEntity> {
    const user = await this.findById(user_id);
    return user;
  }

  // set profile image 
  public async setProfileImage(user_id: string, newProfileImage: string): Promise<UserEntity> {
    const user = await this.getCurrentUser(user_id);
    if (!user) throw new NotFoundException('User not found');

    if(user.avatar === null){
      user.avatar = newProfileImage;
    }
    else{
      await this.removeProfileImage(user_id);
      user.avatar = newProfileImage;
    } 
    return await this.userRepo.save(user);
  }

  // remove profile image 
  public async removeProfileImage(user_id: string): Promise<UserEntity> {
    const user = await this.getCurrentUser(user_id);
    if (!user.avatar || user.avatar === null) throw new NotFoundException('User does not have a profile image');

    const imgPath = join(process.cwd(), 'images', user.avatar);
    unlinkSync(imgPath);
    user.avatar = null;
    return await this.userRepo.save(user);
  }
}
