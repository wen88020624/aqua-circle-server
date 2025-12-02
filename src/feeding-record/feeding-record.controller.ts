import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { FeedingRecordService } from './feeding-record.service';
import { CreateFeedingRecordDto, UpdateFeedingRecordDto } from './dto/create-feeding-record.dto';

@ApiTags('餵食記錄管理')
@Controller('feeding-records')
export class FeedingRecordController {
  constructor(private readonly feedingRecordService: FeedingRecordService) {}

  @Post()
  @ApiOperation({ summary: '新增餵食記錄' })
  @ApiResponse({ status: 201, description: '餵食記錄新增成功' })
  @ApiResponse({ status: 400, description: '輸入驗證失敗' })
  create(@Body() createFeedingRecordDto: CreateFeedingRecordDto) {
    return this.feedingRecordService.create(createFeedingRecordDto);
  }

  @Get()
  @ApiOperation({ summary: '查詢所有餵食記錄' })
  @ApiQuery({ name: 'aquariumId', required: false, description: '魚缸 ID（可選，用於查詢特定魚缸的記錄）' })
  @ApiResponse({ status: 200, description: '成功取得餵食記錄列表' })
  findAll(@Query('aquariumId') aquariumId?: string) {
    if (aquariumId) {
      return this.feedingRecordService.findByAquarium(+aquariumId);
    }
    return this.feedingRecordService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新餵食記錄' })
  @ApiParam({ name: 'id', description: '餵食記錄 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '餵食記錄更新成功' })
  @ApiResponse({ status: 404, description: '餵食記錄不存在' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateFeedingRecordDto: UpdateFeedingRecordDto) {
    return this.feedingRecordService.update(id, updateFeedingRecordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '刪除餵食記錄' })
  @ApiParam({ name: 'id', description: '餵食記錄 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '餵食記錄刪除成功' })
  @ApiResponse({ status: 404, description: '餵食記錄不存在' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.feedingRecordService.remove(id);
  }
}

