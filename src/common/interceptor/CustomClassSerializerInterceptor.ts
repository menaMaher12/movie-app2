/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClassSerializerInterceptor } from '@nestjs/common';

@Injectable()
export class CustomClassSerializerInterceptor extends ClassSerializerInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const request = context.switchToHttp().getRequest();

        // Webhook path
        if (request.url.startsWith('/api/v1/payment/webhook')) {
            return next.handle(); //  serialization
        }

        return super.intercept(context, next); // serialization
    }
}
