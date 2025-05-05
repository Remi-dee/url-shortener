import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { HttpException } from '@nestjs/common';

describe('UrlController', () => {
  let controller: UrlController;
  let service: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [UrlService],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('encode', () => {
    it('should create a new shortened URL', () => {
      const createUrlDto: CreateUrlDto = {
        url: 'https://example.com',
      };

      const result = controller.encode(createUrlDto);

      expect(result).toBeDefined();
      expect(result.shortUrl).toContain('http://localhost:3000/');
      expect(result.shortUrl.split('/').pop()!).toHaveLength(8);
    });
  });

  describe('decode', () => {
    it('should return the original URL', () => {
      const createUrlDto: CreateUrlDto = {
        url: 'https://example.com',
      };

      const encoded = controller.encode(createUrlDto);
      const shortCode = encoded.shortUrl.split('/').pop()!;
      const result = controller.decode(shortCode);

      expect(result).toBeDefined();
      expect(result.originalUrl).toBe(createUrlDto.url);
    });

    it('should throw NotFoundException for non-existent short code', () => {
      expect(() => controller.decode('nonexistent')).toThrow(HttpException);
    });
  });

  describe('getStatistics', () => {
    it('should return URL statistics', () => {
      const createUrlDto: CreateUrlDto = {
        url: 'https://example.com',
      };

      const encoded = controller.encode(createUrlDto);
      const shortCode = encoded.shortUrl.split('/').pop()!;
      const result = controller.getStatistics(shortCode);

      expect(result).toBeDefined();
      expect(result!.visits).toBe(0);
      expect(result!.lastVisited).toBeUndefined();
      expect(result!.createdAt).toBeDefined();
    });

    it('should throw NotFoundException for non-existent short code', () => {
      expect(() => controller.getStatistics('nonexistent')).toThrow(
        HttpException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all URLs', () => {
      const urls = [
        { url: 'https://example1.com' },
        { url: 'https://example2.com' },
      ].map((dto) => {
        controller.encode(dto as CreateUrlDto);
        return dto.url;
      });

      const result = controller.findAll();

      expect(result).toHaveLength(2);
      expect(result.map((u) => u.originalUrl)).toEqual(
        expect.arrayContaining(urls),
      );
    });
  });

  describe('search', () => {
    it('should return empty array for queries shorter than 3 characters', () => {
      const result = controller.search('ex');
      expect(result).toHaveLength(0);
    });

    it('should find URLs matching the search query', () => {
      const urls = [
        { url: 'https://example1.com' },
        { url: 'https://test.com' },
      ].map((dto) => controller.encode(dto as CreateUrlDto));

      const results = controller.search('example');

      expect(results).toHaveLength(1);
      expect(results[0].originalUrl).toBe('https://example1.com');
    });
  });

  describe('redirect', () => {
    it('should redirect to the original URL', async () => {
      const createUrlDto: CreateUrlDto = {
        url: 'https://example.com',
      };

      const encoded = controller.encode(createUrlDto);
      const shortCode = encoded.shortUrl.split('/').pop()!;
      const result = await controller.redirect(shortCode);

      expect(result).toEqual({ url: createUrlDto.url });
    });

    it('should throw NotFoundException for non-existent short code', async () => {
      await expect(controller.redirect('nonexistent')).rejects.toThrow(
        HttpException,
      );
    });
  });
});
