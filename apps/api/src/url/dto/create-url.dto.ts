import { IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  @IsString()
  url: string;
}
