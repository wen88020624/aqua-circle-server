import { Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Api } from '../decorators/api.decorator';
import { WaterQualityRecordService } from './water-quality-record.service';
import {
  CreateWaterQualityRecordDto,
  UpdateWaterQualityRecordDto,
} from './dto/create-water-quality-record.dto';
import { WaterQualityRecordEntity } from './entities/water-quality-record.entity';

@Api({ path: 'water-quality-records', tag: '水質檢測記錄管理' })
export class WaterQualityRecordController {
  constructor(
    private readonly waterQualityRecordService: WaterQualityRecordService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: '新增水質檢測記錄成功',
    type: WaterQualityRecordEntity,
  })
  @ApiBadRequestResponse({
    description: '輸入驗證失敗或所屬魚缸不存在',
  })
  create(@Body() createWaterQualityRecordDto: CreateWaterQualityRecordDto) {
    return this.waterQualityRecordService.create(createWaterQualityRecordDto);
  }

  @Get()
  @ApiOkResponse({
    description: '取得所有水質檢測記錄列表',
    type: [WaterQualityRecordEntity],
  })
  findAll() {
    return this.waterQualityRecordService.findAll();
  }

  @Patch(':id')
  @ApiOkResponse({
    description: '更新水質檢測記錄成功',
    type: WaterQualityRecordEntity,
  })
  @ApiBadRequestResponse({
    description: '參數不符合要求或所屬魚缸不存在',
  })
  @ApiNotFoundResponse({
    description: '水質檢測記錄不存在',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWaterQualityRecordDto: UpdateWaterQualityRecordDto,
  ) {
    return this.waterQualityRecordService.update(
      id,
      updateWaterQualityRecordDto,
    );
  }

  @Delete(':id')
  @ApiOkResponse({
    description: '刪除水質檢測記錄成功',
    type: WaterQualityRecordEntity,
  })
  @ApiNotFoundResponse({
    description: '水質檢測記錄不存在',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.waterQualityRecordService.remove(id);
  }
}
