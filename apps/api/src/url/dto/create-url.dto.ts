import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({
    description: 'The URL to be shortened',
    example: 'https://example.com/very/long/url',
  })
  @IsUrl()
  url: string;
}
