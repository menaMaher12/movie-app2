/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentEntity } from './entity/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    controllers: [PaymentController],
    providers: [PaymentService],
    imports: [TypeOrmModule.forFeature([PaymentEntity])],
})
export class PaymentModule {}
