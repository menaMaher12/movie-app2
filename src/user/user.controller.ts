/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Get all users
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users', type: [UserEntity] })
  async getAllUsers(): Promise<{ success: boolean; message: string; data: UserEntity[] }> {
    const users = await this.userService.findAll();
    return {
      success: true,
      message: 'Users fetched successfully',
      data: users,
    };
  }

  //Get user by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserEntity })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(
    @Param('id') id: number,
  ): Promise<{ success: boolean; message: string; data: UserEntity }> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      success: true,
      message: 'User fetched successfully',
      data: user,
    };
  }

  // Create user
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createUser(
    @Body() userDto: CreateUserDto,
  ): Promise<{ success: boolean; message: string; data: UserEntity }> {
    const createdUser = await this.userService.create(userDto);
    return {
      success: true,
      message: 'User created successfully',
      data: createdUser,
    };
  }

  // Update user
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ success: boolean; message: string; data: UserEntity }> {
    const updatedUser = await this.userService.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  // Delete user
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUser(
    @Param('id') id: number,
  ): Promise<{ success: boolean; message: string }> {
    const deleted = await this.userService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { success: true, message: 'User deleted successfully' };
  }

  // Verify user
  @Patch(':id/verify')
  @ApiOperation({ summary: 'Verify a user account' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'User verified successfully' })
  async verifyUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean; message: string; data?: UserEntity }> {
    const verifiedUser = await this.userService.verifyUser(id);
    if (!verifiedUser) {
      throw new NotFoundException(`User with ID ${id} not found or already verified`);
    }
    return {
      success: true,
      message: 'User verified successfully',
      data: verifiedUser,
    };
  }
}
