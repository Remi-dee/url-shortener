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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('urls')
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('api/encode')
  @ApiOperation({ summary: 'Create a shortened URL' })
  @ApiResponse({
    status: 201,
    description: 'URL has been successfully shortened',
  })
  @ApiResponse({ status: 400, description: 'Invalid URL provided' })
  encode(@Body() createUrlDto: CreateUrlDto): { shortUrl: string } {
    const url = this.urlService.create(createUrlDto);
    return {
      shortUrl: `${process.env.FRONTEND_URL}/${url.shortCode}`,
    };
  }

  @Get('api/decode/:code')
  @ApiOperation({ summary: 'Get original URL from short code' })
  @ApiParam({ name: 'code', description: 'Short URL code' })
  @ApiResponse({ status: 200, description: 'Original URL found' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  decode(@Param('code') code: string): { originalUrl: string } {
    const url = this.urlService.findByShortCode(code);
    if (!url) {
      throw new HttpException('URL not found', HttpStatus.NOT_FOUND);
    }
    return { originalUrl: url.originalUrl };
  }

  @Get('api/statistic/:code')
  @ApiOperation({ summary: 'Get URL statistics' })
  @ApiParam({ name: 'code', description: 'Short URL code' })
  @ApiResponse({ status: 200, description: 'URL statistics retrieved' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  getStatistics(@Param('code') code: string) {
    const url = this.urlService.findByShortCode(code);
    if (!url) {
      throw new HttpException('URL not found', HttpStatus.NOT_FOUND);
    }
    return this.urlService.getStatistics(code);
  }

  @Get('api/list')
  @ApiOperation({ summary: 'Get all URLs' })
  @ApiResponse({ status: 200, description: 'List of all URLs' })
  findAll(): Url[] {
    return this.urlService.findAll();
  }

  @Get('api/search')
  @ApiOperation({ summary: 'Search URLs' })
  @ApiQuery({ name: 'q', description: 'Search query (minimum 3 characters)' })
  @ApiResponse({ status: 200, description: 'List of matching URLs' })
  search(@Query('q') query: string): Url[] {
    return this.urlService.search(query);
  }

  @Get(':code')
  @ApiOperation({ summary: 'Redirect to original URL' })
  @ApiParam({ name: 'code', description: 'Short URL code' })
  @ApiResponse({ status: 302, description: 'Redirect to original URL' })
  @ApiResponse({ status: 404, description: 'URL not found' })
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
  @ApiOperation({ summary: 'Delete a URL' })
  @ApiParam({ name: 'code', description: 'Short URL code' })
  @ApiResponse({ status: 200, description: 'URL successfully deleted' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  remove(@Param('code') code: string) {
    return this.urlService.remove(code);
  }
}
