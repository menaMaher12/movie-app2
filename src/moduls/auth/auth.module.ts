/* eslint-disable prettier/prettier */

import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MailModule ,
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
     inject:[ConfigService],
     useFactory:(configService: ConfigService) => ({
      global: true,
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn:'1d' },
    }),
    }),
  ],
  providers: [AuthService ],
  controllers: [AuthController],
  exports: [AuthService,JwtModule],
})
export class AuthModule {}
