import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UrlController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/api/encode (POST)', () => {
    it('should create a new shortened URL', () => {
      return request(app.getHttpServer())
        .post('/api/encode')
        .send({ url: 'https://example.com' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('shortUrl');
          expect(res.body.shortUrl).toContain('http://localhost:3000/');
          expect(res.body.shortUrl.split('/').pop()).toHaveLength(8);
        });
    });

    it('should return 400 for invalid URL', () => {
      return request(app.getHttpServer())
        .post('/api/encode')
        .send({ url: 'not-a-url' })
        .expect(400);
    });
  });

  describe('/api/decode/:code (GET)', () => {
    it('should return the original URL', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/encode')
        .send({ url: 'https://example.com' });

      const shortCode = createResponse.body.shortUrl.split('/').pop();

      return request(app.getHttpServer())
        .get(`/api/decode/${shortCode}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('originalUrl', 'https://example.com');
        });
    });

    it('should return 404 for non-existent short code', () => {
      return request(app.getHttpServer())
        .get('/api/decode/nonexistent')
        .expect(404);
    });
  });

  describe('/api/statistic/:code (GET)', () => {
    it('should return URL statistics', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/encode')
        .send({ url: 'https://example.com' });

      const shortCode = createResponse.body.shortUrl.split('/').pop();

      return request(app.getHttpServer())
        .get(`/api/statistic/${shortCode}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('visits', 0);
          expect(res.body).toHaveProperty('createdAt');
        });
    });

    it('should return 404 for non-existent short code', () => {
      return request(app.getHttpServer())
        .get('/api/statistic/nonexistent')
        .expect(404);
    });
  });

  describe('/api/list (GET)', () => {
    it('should return all URLs', async () => {
      await request(app.getHttpServer())
        .post('/api/encode')
        .send({ url: 'https://example1.com' });

      await request(app.getHttpServer())
        .post('/api/encode')
        .send({ url: 'https://example2.com' });

      return request(app.getHttpServer())
        .get('/api/list')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThanOrEqual(2);
        });
    });
  });

  describe('/api/search (GET)', () => {
    it('should return empty array for queries shorter than 3 characters', () => {
      return request(app.getHttpServer())
        .get('/api/search?q=ex')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body).toHaveLength(0);
        });
    });

    it('should find URLs matching the search query', async () => {
      await request(app.getHttpServer())
        .post('/api/encode')
        .send({ url: 'https://example1.com' });

      await request(app.getHttpServer())
        .post('/api/encode')
        .send({ url: 'https://test.com' });

      return request(app.getHttpServer())
        .get('/api/search?q=example')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThanOrEqual(1);
          expect(res.body[0].originalUrl).toBe('https://example1.com');
        });
    });
  });

  describe('/:code (GET)', () => {
    it('should redirect to the original URL', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/encode')
        .send({ url: 'https://example.com' });

      const shortCode = createResponse.body.shortUrl.split('/').pop();

      return request(app.getHttpServer())
        .get(`/${shortCode}`)
        .expect(302)
        .expect('Location', 'https://example.com');
    });

    it('should return 404 for non-existent short code', () => {
      return request(app.getHttpServer()).get('/nonexistent').expect(404);
    });
  });
});
