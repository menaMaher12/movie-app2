/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './moduls/movie/movie.module';
import { UserModule } from './moduls/user/user.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from './moduls/user/entities/user.entity';
import { CouponModule } from './moduls/coupon/coupon.module';
import { GenersModule } from './moduls/geners/geners.module';
import { AuthModule } from './moduls/auth/auth.module';
import { RatingModule } from './moduls/rating/rating.module';
import { SubscriptionModule } from './moduls/subscription/subscription.module';
import { PaymentModule } from './moduls/payment/payment.module';
import { PeopleModule } from './moduls/people/people.module';
import { MovieEntity } from './moduls/movie/entity/movie.entity';
import { GenreEntity } from './moduls/geners/entity/genre.entity';
import { PeopleEntity } from './moduls/people/entity/people.entity';
import { MoviePeopleEntity } from './moduls/movie-people/entity/movie_people.entity';
import { SubscriptionEntity } from './moduls/subscription/entity/subscription.entity';
import { PaymentEntity } from './moduls/payment/entity/payment.entity';
import { CouponEntity } from './moduls/coupon/entity/coupon.entity';
import { UserCouponsEntity } from './moduls/user-coupon/entity/user_coupons.entity';
import { RatingEntity } from './moduls/rating/entity/rating.entity';
import { UserCouponModule } from './moduls/user-coupon/user-coupon.module';
import { UploadModule } from './moduls/upload/upload.module';
import { MailModule } from './moduls/mail/mail.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MoviePeopleModule } from './moduls/movie-people/movie-people.module';
import { loggerMiddleware } from './common/middleware/logger.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CloudinaryModule } from './moduls/cloudinary/cloudinary.module';
import { SubscriptionPlanModule } from './moduls/subscription-plan/subscription-plan.module';
import { SubscriptionPlanEntity } from './moduls/subscription-plan/entity/subscription-plan.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { CustomClassSerializerInterceptor } from './common/interceptor/CustomClassSerializerInterceptor';
@Module({
  imports: [
    MovieModule,
    UserModule,
    CouponModule,
    GenersModule,
    AuthModule,
    RatingModule,
    CloudinaryModule,
    MoviePeopleModule,
    SubscriptionModule,
    PaymentModule,
    PeopleModule,
    SubscriptionPlanModule,
    ScheduleModule.forRoot(), // Enable scheduling module
    ThrottlerModule.forRoot([
        {
          name:'default',
          ttl:600,  // time to live is 60 seconds
          limit:10
        },
        {
          name:'auth',
          ttl:60000,  // time to live is 60 seconds
          limit:5
        },
        {
          name:'movie',
          ttl:60000,  // time to live is 60 seconds
          limit:20
        },
        {
          name :'user',
          ttl:60000,  // time to live is 60 seconds
          limit:15
        }
      ]
    ),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        return {
          type: "mysql",
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [
            UserEntity,
            MovieEntity,
            GenreEntity,
            PeopleEntity,
            MoviePeopleEntity,
            SubscriptionEntity,
            PaymentEntity,
            CouponEntity,
            SubscriptionPlanEntity,
            UserCouponsEntity,
            RatingEntity,
          ],
          synchronize: process.env.NODE_ENV !== 'production',
        }
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/.${process.env.NODE_ENV}.env`,
    }),
    UserCouponModule,
    UploadModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService,{
    provide :APP_INTERCEPTOR,
    useClass : CustomClassSerializerInterceptor
  },{
    provide : APP_GUARD ,
    useClass : ThrottlerGuard
  }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(loggerMiddleware)
    .exclude(
      {
        path :"api/v1/movies/:id",
        method : RequestMethod.GET
      }
    )
    .forRoutes({
      path:"api/v1/movies",
      method: RequestMethod.GET
    },
    {
      path:"api/v1/users",
      method: RequestMethod.GET
    })

    // consumer.apply(loggerMiddleware2).forRoutes({
    //   path:"api/v1/movies",
    //   method: RequestMethod.GET
    // },
    // {
    //   path:"api/v1/users",
    //   method: RequestMethod.GET
    // });
  }
 }
