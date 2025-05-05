import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Redirect,
  Query,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './interfaces/url.interface';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('api/encode')
  encode(@Body() createUrlDto: CreateUrlDto): { shortUrl: string } {
    const url = this.urlService.create(createUrlDto);
    return {
      shortUrl: `${process.env.FRONTEND_URL}/${url.shortCode}`,
    };
  }

  @Get('api/decode/:code')
  decode(@Param('code') code: string): { originalUrl: string } {
    const url = this.urlService.findByShortCode(code);
    if (!url) {
      throw new HttpException('URL not found', HttpStatus.NOT_FOUND);
    }
    return { originalUrl: url.originalUrl };
  }

  @Get('api/statistic/:code')
  getStatistics(@Param('code') code: string) {
    const url = this.urlService.findByShortCode(code);
    if (!url) {
      throw new HttpException('URL not found', HttpStatus.NOT_FOUND);
    }

    // Mock data for demonstration
    return {
      visits: url.visits,
      createdAt: url.createdAt,
      lastVisited: url.lastVisited,
      visitsByDay: [
        { date: '2024-03-01', count: 5 },
        { date: '2024-03-02', count: 8 },
        { date: '2024-03-03', count: 12 },
      ],
      visitsByCountry: [
        { country: 'United States', count: 15 },
        { country: 'United Kingdom', count: 6 },
        { country: 'Germany', count: 4 },
      ],
      visitsByDevice: [
        { device: 'Desktop', count: 12 },
        { device: 'Mobile', count: 8 },
        { device: 'Tablet', count: 3 },
      ],
    };
  }

  @Get('api/list')
  findAll(): Url[] {
    return this.urlService.findAll();
  }

  @Get('api/search')
  search(@Query('q') query: string): Url[] {
    return this.urlService.search(query);
  }

  @Get(':code')
  @Redirect()
  async redirect(@Param('code') code: string) {
    const url = this.urlService.findByShortCode(code);
    if (!url) {
      throw new HttpException('URL not found', HttpStatus.NOT_FOUND);
    }
    this.urlService.incrementVisits(code);
    return { url: url.originalUrl };
  }

  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.urlService.remove(code);
  }
}
