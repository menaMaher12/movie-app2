/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthProvider } from './auth.provider';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';

@Module({
  controllers: [UserController],
  providers: [UserService ,AuthProvider],
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([UserEntity]) ,forwardRef(() => AuthModule) ,MailModule],
})
export class UserModule {}
