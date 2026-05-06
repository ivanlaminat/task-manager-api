import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Task Manager API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let createdTaskId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ─── AUTH ────────────────────────────────────────────────────────────────────

  describe('Auth', () => {
    const testUser = {
      email: `test_${Date.now()}@example.com`,
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    it('POST /auth/register — should register a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email', testUser.email);
    });

    it('POST /auth/register — should fail if email already exists', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(400);
    });

    it('POST /auth/register — should fail with invalid email', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'not-an-email', password: 'password123' })
        .expect(400);
    });

    it('POST /auth/register — should fail with short password', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'valid@example.com', password: '123' })
        .expect(400);
    });

    it('POST /auth/login — should login and return token', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      authToken = res.body.accessToken;
    });

    it('POST /auth/login — should fail with wrong password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' })
        .expect(401);
    });

    it('POST /auth/login — should fail with unknown email', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nobody@example.com', password: 'password123' })
        .expect(401);
    });
  });

  // ─── TASKS ───────────────────────────────────────────────────────────────────

  describe('Tasks', () => {
    it('GET /tasks — should return 401 without token', async () => {
      await request(app.getHttpServer()).get('/tasks').expect(401);
    });

    it('GET /tasks — should return array of tasks', async () => {
      const res = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /tasks — should create a new task', async () => {
      const res = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'E2E Test Task',
          description: 'Created during e2e test',
          status: 'todo',
          priority: 'medium',
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('E2E Test Task');
      createdTaskId = res.body.id;
    });

    it('POST /tasks — should fail without title', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'No title task' })
        .expect(400);
    });

    it('GET /tasks/:id — should return the created task', async () => {
      const res = await request(app.getHttpServer())
        .get(`/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.id).toBe(createdTaskId);
      expect(res.body.title).toBe('E2E Test Task');
    });

    it('GET /tasks/:id — should return 404 for non-existent task', async () => {
      await request(app.getHttpServer())
        .get('/tasks/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('PUT /tasks/:id — should update the task', async () => {
      const res = await request(app.getHttpServer())
        .put(`/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated E2E Task', status: 'in_progress' })
        .expect(200);

      expect(res.body.title).toBe('Updated E2E Task');
      expect(res.body.status).toBe('in_progress');
    });

    it('PUT /tasks/:id — should return 404 for non-existent task', async () => {
      await request(app.getHttpServer())
        .put('/tasks/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Ghost Task' })
        .expect(404);
    });

    it('GET /tasks?status=in_progress — should filter by status', async () => {
      const res = await request(app.getHttpServer())
        .get('/tasks?status=in_progress')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((task: any) => {
        expect(task.status).toBe('in_progress');
      });
    });

    it('DELETE /tasks/:id — should delete the task', async () => {
      await request(app.getHttpServer())
        .delete(`/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });

    it('GET /tasks/:id — should return 404 after deletion', async () => {
      await request(app.getHttpServer())
        .get(`/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('DELETE /tasks/:id — should return 404 for non-existent task', async () => {
      await request(app.getHttpServer())
        .delete('/tasks/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
