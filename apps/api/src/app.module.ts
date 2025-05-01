import { Module } from '@nestjs/common';

import { UrlModule } from './url/url.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [UrlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
