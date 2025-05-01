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
      shortUrl: `http://localhost:3000/${url.shortCode}`,
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
    return {
      visits: url.visits,
      lastVisited: url.lastVisited,
      createdAt: url.createdAt,
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
}
