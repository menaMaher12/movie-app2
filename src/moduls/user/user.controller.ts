/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
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
  UseGuards,
  UseInterceptors,
  Query,
  UploadedFile,
  Res,
  // ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadOptions } from '../../utils/upload.options';
import type { JwtPayloadType } from '../../utils/types';
import type { Response } from 'express';
import { AuthGuard } from '../../common/guards/auth_guard/auth.guard';
import { CurrentUser } from '../../common/decrators/currentuser/currentuser.decorator';
import { UserRole } from '../../utils/enum';
import { Role } from '../../common/decrators/user-role/user-role.decorator';
import { AuthRoleGuard } from '../../common/guards/role_guard/auth.role.guard';
import { RespExcludeInterceptor } from '../../common/interceptor/resp-exclude/resp-exclude.interceptor';
@ApiTags('User')
@Controller('api/v1/users')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class UserController {
  constructor(private readonly userService: UserService ,private readonly configService: ConfigService) {}

    // Get current user
  @Get('current-user')
  @ApiOperation({ summary: 'Get current user details' })
  @UseGuards(AuthGuard)
  async getCurrentUser(
    @CurrentUser() payload: JwtPayloadType,
  ): Promise<{ success: boolean; message: string; data?: UserEntity }> {
    const user = await this.userService.getCurrentUser(String(payload.userId));
    if (!user) {
      throw new NotFoundException(`User with ID ${payload.userId} not found`);
    }
    return {
      success: true,
      message: 'User fetched successfully',
      data: user,
    };
  }
  //Get all users
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users', type: [UserEntity] })
  @Role(UserRole.ADMIN)
  @UseGuards(AuthRoleGuard)
  // @UseInterceptors(RespExcludeInterceptor)
  // @UseInterceptors(ClassSerializerInterceptor)
  async getAllUsers(@Query() query: any): Promise<{ success: boolean; message: string; data: UserEntity[]  ; totalPerPage: number ; pages : number}> {
    const { data: users, total } = await this.userService.findAll(query);

    return {
      success: true,
      message: 'Users fetched successfully',
      data: users,
      totalPerPage: users.length,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      pages : query?.limit ? Math.ceil(total / query.limit) : 1,
    };
  }

  //Get user by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserEntity })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseInterceptors(RespExcludeInterceptor)
  @Role(UserRole.ADMIN , UserRole.MODERATOR , UserRole.USER)
  @UseGuards(AuthRoleGuard)
  async getUserById(
    @Param('id') id:string,
  ): Promise<{ success: boolean; message: string; data: UserEntity }> {
    const user = await this.userService.findById(id);
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
  @Role(UserRole.ADMIN , UserRole.MODERATOR)
  @UseGuards(AuthRoleGuard)
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

  // @Post("signup")
  // @ApiOperation({ summary: 'Create a new user' })
  // @ApiBody({ type: CreateUserDto })
  // @ApiResponse({ status: 201, description: 'User created successfully' })
  // @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  // async register(
  //   @Body() userDto: CreateUserDto,
  // ): Promise<{ success: boolean; message: string; data: UserEntity }> {
  //   const newUser = await this.userService.register(userDto);
  //   return {
  //     success: true,
  //     message: 'User created successfully',
  //     data: newUser,
  //   };
  // }
  // Update user
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Role(UserRole.ADMIN , UserRole.MODERATOR , UserRole.USER)
  @UseGuards(AuthRoleGuard)
  async updateUser(
    @Param('id' ) id: string,
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
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @Role(UserRole.ADMIN , UserRole.MODERATOR , UserRole.USER)
  @UseGuards(AuthRoleGuard)
  async deleteUser(
    @Param('id') id: string,@CurrentUser() payload : JwtPayloadType
  ): Promise<{ success: boolean; message: string }> {
    const deleted = await this.userService.remove(id ,payload);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { success: true, message: 'User deleted successfully' };
  }

  // Verify user
  @Patch(':id/verify')
  @ApiOperation({ summary: 'Verify a user account' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User verified successfully' })
  async verifyUser(
    @Param('id') id: string,
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

  // upload user image
  @Post('upload-image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("user_image", uploadOptions))
  async uploadUserImage(@UploadedFile() file: Express.Multer.File , @CurrentUser() payload: JwtPayloadType): Promise<{ success: boolean; message: string; data: string }> {
    if (!file) {
      throw new NotFoundException('File not uploaded');
    }

    const user = await this.userService.setProfileImage(payload.userId, file.filename);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'User image uploaded successfully',
      data: user.avatar || " ",
    };
  }

  @Delete('remove-image')
  @UseGuards(AuthGuard)
  async removeUserImage(@CurrentUser() payload: JwtPayloadType): Promise<{ success: boolean; message: string; data: string }> {
    const user = await this.userService.removeProfileImage(payload.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      success: true,
      message: 'User image removed successfully',
      data: user.avatar || " ",
    };
  }

  // get my profile image 
  @Get("profile-image")
  @UseGuards(AuthGuard)
  async getMyProfileImage(@CurrentUser() payload: JwtPayloadType ,@Res() res:Response) {
    const user = await this.userService.getCurrentUser(payload.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if(!user.avatar){
      throw new NotFoundException('User not have profile image ');
    }
    return res.sendFile(user.avatar, { root: "images" });
  }
}