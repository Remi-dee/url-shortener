import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';

describe('UrlService', () => {
  let service: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlService],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new shortened URL', () => {
      const createUrlDto: CreateUrlDto = {
        url: 'https://example.com',
      };

      const result = service.create(createUrlDto);

      expect(result).toBeDefined();
      expect(result.originalUrl).toBe(createUrlDto.url);
      expect(result.shortCode).toHaveLength(8);
      expect(result.visits).toBe(0);
    });
  });

  describe('findByShortCode', () => {
    it('should find a URL by its short code', () => {
      const createUrlDto: CreateUrlDto = {
        url: 'https://example.com',
      };

      const createdUrl = service.create(createUrlDto);
      const foundUrl = service.findByShortCode(createdUrl.shortCode);

      expect(foundUrl).toBeDefined();
      expect(foundUrl?.originalUrl).toBe(createUrlDto.url);
    });

    it('should return undefined for non-existent short code', () => {
      const foundUrl = service.findByShortCode('nonexistent');
      expect(foundUrl).toBeUndefined();
    });
  });

  describe('incrementVisits', () => {
    it('should increment visit count', () => {
      const createUrlDto: CreateUrlDto = {
        url: 'https://example.com',
      };

      const createdUrl = service.create(createUrlDto);
      service.incrementVisits(createdUrl.shortCode);
      const updatedUrl = service.findByShortCode(createdUrl.shortCode);

      expect(updatedUrl?.visits).toBe(1);
      expect(updatedUrl?.lastVisited).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return all URLs', () => {
      const urls = [
        { url: 'https://example1.com' },
        { url: 'https://example2.com' },
      ].map((dto) => service.create(dto as CreateUrlDto));

      const allUrls = service.findAll();

      expect(allUrls).toHaveLength(2);
      expect(allUrls).toEqual(expect.arrayContaining(urls));
    });
  });

  describe('search', () => {
    it('should return empty array for queries shorter than 3 characters', () => {
      const result = service.search('ex');
      expect(result).toHaveLength(0);
    });

    it('should find URLs matching the search query', () => {
      const urls = [
        { url: 'https://example1.com' },
        { url: 'https://test.com' },
      ].map((dto) => service.create(dto as CreateUrlDto));

      const results = service.search('example');

      expect(results).toHaveLength(1);
      expect(results[0].originalUrl).toBe(urls[0].originalUrl);
    });
  });
});
