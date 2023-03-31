import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from '../src/entities';
import { UsersModule } from '../src/users/users.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.development' }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: +configService.get('DB_PORT'),
            username: configService.get('DB_USER'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME'),
            entities,
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
        UsersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/v1/users (GET) - response 200 status', () => {
    return request(app.getHttpServer()).get('/api/v1/users').expect(200);
  });

  it('/api/v1/users (POST) add user - response 201 status', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        username: 'user',
        password:
          '$2b$10$mg7KG9fSZaHbOU0EZzSYk.I20qiYB/AAbSOtb37kODVTXWQVLEmCm',
      })
      .expect(201)
      .then((response) => {
        return request(app.getHttpServer()).delete(
          `/api/v1/users/${response.body.id}`,
        );
      })
      .catch((err) => console.log(`ERROR: ${err.message}`));
  });

  it('/api/v1/users (POST) add user - user is added', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        username: 'user',
        password:
          '$2b$10$mg7KG9fSZaHbOU0EZzSYk.I20qiYB/AAbSOtb37kODVTXWQVLEmCm',
      })
      .then((response) => {
        return request(app.getHttpServer())
          .get(`/api/v1/users/${response.body.id}`)
          .expect({ id: response.body.id, username: 'user', roles: ['user'] })
          .then(() => {
            return request(app.getHttpServer()).delete(
              `/api/v1/users/${response.body.id}`,
            );
          })
          .catch((err) => console.log(`ERROR: ${err.message}`));
      })
      .catch((err) => console.log(`ERROR: ${err.message}`));
  });

  it('/api/v1/users/:uuid (PATCH) update user - response 200 status', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        username: 'user',
        password:
          '$2b$10$mg7KG9fSZaHbOU0EZzSYk.I20qiYB/AAbSOtb37kODVTXWQVLEmCm',
      })
      .then((response) => {
        return request(app.getHttpServer())
          .patch(`/api/v1/users/${response.body.id}`)
          .send({ username: 'newName' })
          .expect(200)
          .then(() => {
            return request(app.getHttpServer()).delete(
              `/api/v1/users/${response.body.id}`,
            );
          })
          .catch((err) => console.log(`ERROR: ${err.message}`));
      })
      .catch((err) => console.log(`ERROR: ${err.message}`));
  });

  it('/api/v1/users/:uuid (PATCH) update user - user is updated', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        username: 'user',
        password:
          '$2b$10$mg7KG9fSZaHbOU0EZzSYk.I20qiYB/AAbSOtb37kODVTXWQVLEmCm',
      })
      .then((response) => {
        return request(app.getHttpServer())
          .patch(`/api/v1/users/${response.body.id}`)
          .send({ username: 'newName' })
          .then(() => {
            return request(app.getHttpServer())
              .get(`/api/v1/users/${response.body.id}`)
              .expect({
                id: response.body.id,
                username: 'newName',
                roles: ['user'],
              })
              .then(() => {
                return request(app.getHttpServer()).delete(
                  `/api/v1/users/${response.body.id}`,
                );
              })
              .catch((err) => console.log(`ERROR: ${err.message}`));
          })
          .catch((err) => console.log(`ERROR: ${err.message}`));
      })
      .catch((err) => console.log(`ERROR: ${err.message}`));
  });

  it('/api/v1/users/:uuid (DELETE) delete user - response 204 status', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        username: 'user',
        password:
          '$2b$10$mg7KG9fSZaHbOU0EZzSYk.I20qiYB/AAbSOtb37kODVTXWQVLEmCm',
      })
      .then((response) => {
        return request(app.getHttpServer())
          .delete(`/api/v1/users/${response.body.id}`)
          .expect(204);
      })
      .catch((err) => console.log(`ERROR: ${err.message}`));
  });
});
