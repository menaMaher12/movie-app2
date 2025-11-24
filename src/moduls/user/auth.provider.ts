/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { randomBytes } from "crypto";
import { MailService } from "../mail/mail.service";
@Injectable()
export class AuthProvider {
    // This class can be expanded to include methods for authentication and authorization
    // Register or Signup User
    constructor(@InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>, private mailService: MailService) { }
    public async register(user: CreateUserDto): Promise<{ userId: string; email: string, role: string }> {
        const { email, password } = user;
        const existingUser = await this.userRepo.findOne({ where: { email } });
        if (existingUser) {
            throw new NotFoundException(`User with email ${email} already exists`);
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const verificationToken = randomBytes(32).toString('hex');
        const newUser = this.userRepo.create({ ...user, password: hashPassword, verificationToken });
        await this.userRepo.save(newUser);
        // jwt token generation can be added here for immediate login after registration
        return { userId: newUser.user_id, email: newUser.email, role: newUser.role };
    }

    public async login(email: string, password: string): Promise<{ userId: string; email: string; role: string }> {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }
        if (user.isVerified === false) {
            let verification = user.verificationToken;
            if (!verification) {
                verification = randomBytes(32).toString('hex');
                user.verificationToken = verification;
                await this.userRepo.save(user);
            }
            try {
                await this.mailService.sendVerificationEmail(user.email, user.firstName, verification);
            }
            catch (error) {
                console.error('Error sending verification email:', error);
            }
            throw new NotFoundException(`Email not verified. A new verification email has been sent to ${email}`);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new NotFoundException(`Invalid password for email ${email}`);
        }
        return { userId: user.user_id, email: user.email, role: user.role };
    }
}