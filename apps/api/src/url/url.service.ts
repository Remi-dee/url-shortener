import { Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './interfaces/url.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UrlService {
  private urls: Map<string, Url> = new Map();

  /**
   * Generates a short code for a URL
   * @returns A short code
   */
  private generateShortCode(): string {
    return uuidv4().substring(0, 8);
  }

  /**
   * Creates a new shortened URL
   * @param createUrlDto The URL to shorten
   * @returns The created URL object
   */
  create(createUrlDto: CreateUrlDto): Url {
    const shortCode = this.generateShortCode();
    const url: Url = {
      id: uuidv4(),
      originalUrl: createUrlDto.url,
      shortCode,
      createdAt: new Date(),
      visits: 0,
    };

    this.urls.set(shortCode, url);
    return url;
  }

  /**
   * Finds a URL by its short code
   * @param shortCode The short code to look up
   * @returns The URL object or undefined if not found
   */
  findByShortCode(shortCode: string): Url | undefined {
    return this.urls.get(shortCode);
  }

  /**
   * Increments the visit count for a URL
   * @param shortCode The short code of the URL
   */
  incrementVisits(shortCode: string): void {
    const url = this.urls.get(shortCode);
    if (url) {
      url.visits++;
      url.lastVisited = new Date();
      this.urls.set(shortCode, url);
    }
  }

  /**
   * Gets all URLs
   * @returns An array of all URLs
   */
  findAll(): Url[] {
    return Array.from(this.urls.values());
  }

  /**
   * Searches URLs by original URL
   * @param query The search query
   * @returns An array of matching URLs
   */
  search(query: string): Url[] {
    if (query.length < 3) {
      return [];
    }

    return Array.from(this.urls.values()).filter((url) =>
      url.originalUrl.toLowerCase().includes(query.toLowerCase()),
    );
  }
}
