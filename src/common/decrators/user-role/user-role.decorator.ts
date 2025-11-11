/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/utils/enum';

export const Role = (...roles: UserRole[]) => SetMetadata('roles', roles);
