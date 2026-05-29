import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Api } from '../decorators/api.decorator';
import { FeedingRecordService } from './feeding-record.service';
import {
  CreateFeedingRecordDto,
  UpdateFeedingRecordDto,
} from './dto/create-feeding-record.dto';
import { FeedingRecordEntity } from './entities/feeding-record.entity';

@Api({ path: 'feeding-records', tag: '餵食記錄管理' })
export class FeedingRecordController {
  constructor(private readonly feedingRecordService: FeedingRecordService) {}

  @Post()
  @ApiCreatedResponse({
    description: '新增餵食記錄成功',
    type: FeedingRecordEntity,
  })
  @ApiBadRequestResponse({
    description:
      '輸入驗證失敗、所屬魚缸不存在、耗材不存在，或耗材 tag 非「飼料」',
  })
  create(@Body() createFeedingRecordDto: CreateFeedingRecordDto) {
    return this.feedingRecordService.create(createFeedingRecordDto);
  }

  @Get()
  @ApiQuery({
    name: 'aquariumId',
    required: false,
    description: '魚缸 ID（可選，篩選特定魚缸的餵食記錄）',
    type: Number,
  })
  @ApiOkResponse({
    description: '取得餵食記錄列表',
    type: [FeedingRecordEntity],
  })
  findAll(@Query('aquariumId') aquariumId?: string) {
    if (aquariumId) {
      return this.feedingRecordService.findByAquarium(+aquariumId);
    }
    return this.feedingRecordService.findAll();
  }

  @Patch(':id')
  @ApiOkResponse({
    description: '更新餵食記錄成功',
    type: FeedingRecordEntity,
  })
  @ApiBadRequestResponse({
    description:
      '參數不符合要求、所屬魚缸不存在、耗材不存在，或耗材 tag 非「飼料」',
  })
  @ApiNotFoundResponse({
    description: '餵食記錄不存在',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFeedingRecordDto: UpdateFeedingRecordDto,
  ) {
    return this.feedingRecordService.update(id, updateFeedingRecordDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: '刪除餵食記錄成功',
    type: FeedingRecordEntity,
  })
  @ApiNotFoundResponse({
    description: '餵食記錄不存在',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.feedingRecordService.remove(id);
  }
}
