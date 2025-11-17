/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { UserEntity } from '../src/moduls/user/entities/user.entity';
import { CreateUserDto } from '../src/moduls/user/dto/create-user.dto';
import { SubscriptionType, UserRole } from '../src/utils/enum';
import * as bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

type userListResType = {
    success: boolean;
    message: string;
    data: UserEntity[];
    totalPerPage: number;
    pages: number;
}

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let userToSave: CreateUserDto[];
    let cookies: string[] = [];
    let newUserLoginAdmin: any;
    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        dataSource = moduleFixture.get<DataSource>(DataSource);
        app = moduleFixture.createNestApplication();
        app.use(cookieParser());
        await app.init();

        // Insert test users
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash('StrongPass123!', salt);

        userToSave = [
            {
                firstName: 'Mina',
                lastName: 'Maher',
                email: 'mina@example.com',
                password: 'StrongPass123!', // plain if entity hashes internally
                phone: '+201112345678',
                avatar: 'https://i.imgur.com/avatar.png',
                subscriptionType: SubscriptionType.FREE,
                role: UserRole.USER,
                verificationToken: 'token-abc-123',
            },
            {
                firstName: 'Sara',
                lastName: 'Youssef',
                email: 'sara.youssef@example.com',
                password: 'PassWord!2025',
                phone: '+201223456789',
                avatar: null,
                subscriptionType: SubscriptionType.BASIC,
                role: UserRole.ADMIN,
                verificationToken: null,
            },
            {
                firstName: 'Omar',
                lastName: 'Ali',
                email: 'omar.ali@example.com',
                password: 'Secure@Pass99',
                phone: '+201334567890',
                avatar: 'https://i.imgur.com/omar.png',
                subscriptionType: SubscriptionType.PREMIUM,
                role: UserRole.USER,
                verificationToken: 'verify-omar-2025',
            },
            {
                firstName: 'Laila',
                lastName: 'Hassan',
                email: 'laila.hassan@example.com',
                password: 'Laila@2025!',
                phone: '+201445678901',
                avatar: 'https://i.imgur.com/laila.jpg',
                subscriptionType: SubscriptionType.FREE,
                role: UserRole.USER,
                verificationToken: null,
            },
        ];

        await dataSource.createQueryBuilder().insert().into(UserEntity).values(userToSave).execute();

        newUserLoginAdmin = {
            firstName: 'Sara',
            lastName: 'Youssef',
            email: 'mina123@example.com',
            password: hashPassword, // hashed password for login user
            phone: '+201223456789',
            isVerified: true,
            avatar: null,
            subscriptionType: SubscriptionType.BASIC,
            role: UserRole.ADMIN,
            verificationToken: null,
        };

        await dataSource.createQueryBuilder().insert().into(UserEntity).values(newUserLoginAdmin).execute();

        const response = await request(app.getHttpServer())
            .post('/api/v1/auth/signin')
            .send({ email: 'mina123@example.com', password: 'StrongPass123!' });

        cookies = response.headers['set-cookie'] as unknown as string[];
        if (!cookies.length) throw new Error('No cookies returned from signin');
    });

    afterEach(async () => {
        await dataSource.createQueryBuilder().delete().from(UserEntity).execute();
        await app.close();
        // await dataSource.destroy(); 
    });

    describe('GET /api/v1/users (findAll users)', () => {

        it('should get all users', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/users')
                .set('Cookie', cookies[0])
                .expect(200);

            const resBody: userListResType = response.body;

            expect(resBody.success).toBe(true);
            expect(resBody.message).toBe('Users fetched successfully');
            expect(resBody.data.length).toBe(5); // 4 inserted + 1 admin
            expect(resBody.totalPerPage).toBe(5);
            expect(resBody.pages).toBe(1);
        });


        it('should filter users by firstName=Laila', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/users?firstName=Laila')
                .set('Cookie', cookies[0])
                .expect(200);

            const resBody: userListResType = response.body;

            expect(resBody.success).toBe(true);
            expect(resBody.message).toBe('Users fetched successfully');
            expect(resBody.data.length).toBe(1);
            expect(resBody.data[0].lastName).toBe('Hassan');
            expect(resBody.totalPerPage).toBe(1);
            expect(resBody.pages).toBe(1);
        });


        it('should return page=1 limit=2 (pagination)', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/users?page=1&limit=2')
                .set('Cookie', cookies[0])
                .expect(200);

            const resBody: userListResType = response.body;

            expect(resBody.success).toBe(true);
            expect(resBody.message).toBe('Users fetched successfully');
            expect(resBody.data.length).toBe(2);
            expect(resBody.totalPerPage).toBe(2);
            expect(resBody.pages).toBe(3); // total 5 users → 2 per page → 3 pages
        });


        it('should return page=2 limit=2 (next page)', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/users?page=2&limit=2')
                .set('Cookie', cookies[0])
                .expect(200);

            const resBody: userListResType = response.body;

            expect(resBody.data.length).toBe(2);
            expect(resBody.totalPerPage).toBe(2);
            expect(resBody.pages).toBe(3);
        });


        it('should return page=3 limit=2 (last page with 1 user)', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/users?page=3&limit=2')
                .set('Cookie', cookies[0])
                .expect(200);

            const resBody: userListResType = response.body;

            expect(resBody.data.length).toBe(1);
            expect(resBody.totalPerPage).toBe(1);
            expect(resBody.pages).toBe(3);
        });

    });

    describe.only('GET /api/v1/users/:id (findOne user)', () => {
        let allUsers: request.Response;
        let reqBody: userListResType;
        beforeEach(async () => {
            allUsers = await request(app.getHttpServer())
                .get("/api/v1/users")
                .set('Cookie', cookies[0])
                .expect(200);

            reqBody = allUsers.body;
            if (reqBody.data.length === 0) {
                throw new Error('No users found to test getUserById');
            }
        });
        it('should get user by ID', async () => {
            const user = await request(app.getHttpServer())
                .get(`/api/v1/users/${reqBody.data[0].user_id}`)
                .set('Cookie', cookies[0])
                .expect(200);
            console.log('User fetched by ID response body:', user.body);
            expect(user.body.success).toBe(true);
            expect(user.body.message).toBe('User fetched successfully');
            expect(user.body.data.user_id).toBe(reqBody.data[0].user_id);
            expect(user.body.data.email).toBe(reqBody.data[0].email);
            expect(user.body.data.firstName).toBe(reqBody.data[0].firstName);
        });

        it('should return 404 for non-existing user ID', async () => {
            const nonExistingUserId = '00000000-0000-0000-0000-000000000000';
                await request(app.getHttpServer())
                .get(`/api/v1/users/${nonExistingUserId}`)
                .set('Cookie', cookies[0])
                .expect(404)
                .catch(error => {
                    expect(error.response.body.message).toBe(`User with ID ${nonExistingUserId} not found`);
                    console.error('Error fetching non-existing user:', error);
                });
        });
    });
});