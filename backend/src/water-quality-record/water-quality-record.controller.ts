import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { WaterQualityRecordService } from './water-quality-record.service';
import { CreateWaterQualityRecordDto, UpdateWaterQualityRecordDto } from './dto/create-water-quality-record.dto';

@ApiTags('水質檢測記錄管理')
@Controller('water-quality-records')
export class WaterQualityRecordController {
  constructor(private readonly waterQualityRecordService: WaterQualityRecordService) {}

  @Post()
  @ApiOperation({ summary: '新增水質檢測記錄' })
  @ApiResponse({ status: 201, description: '水質檢測記錄新增成功' })
  @ApiResponse({ status: 400, description: '輸入驗證失敗' })
  create(@Body() createWaterQualityRecordDto: CreateWaterQualityRecordDto) {
    return this.waterQualityRecordService.create(createWaterQualityRecordDto);
  }

  @Get()
  @ApiOperation({ summary: '查詢所有水質檢測記錄' })
  @ApiResponse({ status: 200, description: '成功取得水質檢測記錄列表' })
  findAll() {
    return this.waterQualityRecordService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新水質檢測記錄' })
  @ApiParam({ name: 'id', description: '水質檢測記錄 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '水質檢測記錄更新成功' })
  @ApiResponse({ status: 404, description: '水質檢測記錄不存在' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateWaterQualityRecordDto: UpdateWaterQualityRecordDto) {
    return this.waterQualityRecordService.update(id, updateWaterQualityRecordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '刪除水質檢測記錄' })
  @ApiParam({ name: 'id', description: '水質檢測記錄 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '水質檢測記錄刪除成功' })
  @ApiResponse({ status: 404, description: '水質檢測記錄不存在' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.waterQualityRecordService.remove(id);
  }
}

