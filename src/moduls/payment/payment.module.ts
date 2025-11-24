/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentEntity } from './entity/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { MailModule } from '../mail/mail.module';
import { StripeService } from './stripe/stripe.service';

@Module({
    controllers: [PaymentController],
    providers: [PaymentService,StripeService],
    imports: [TypeOrmModule.forFeature([PaymentEntity]),JwtModule,ConfigModule,UserModule ,SubscriptionModule ,MailModule],
})
export class PaymentModule {}
