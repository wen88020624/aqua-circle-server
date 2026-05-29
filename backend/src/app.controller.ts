import { Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Api } from './decorators/api.decorator';
import { AppService } from './app.service';

@Api({ path: '', tag: '應用程式' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({
    description: '健康檢查',
    schema: { type: 'string', example: 'Hello World!' },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
