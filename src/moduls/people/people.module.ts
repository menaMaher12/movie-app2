/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleEntity } from './entity/people.entity';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { uploadOptions } from 'src/utils/upload.options';

@Module({
  controllers: [PeopleController],
  providers: [PeopleService],
  imports: [TypeOrmModule.forFeature([PeopleEntity]), JwtModule ,MulterModule.register(uploadOptions)],
})
export class PeopleModule {}
