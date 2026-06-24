import { Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Api } from '../decorators/api.decorator';
import { MedicationRecordService } from './medication-record.service';
import {
  CreateMedicationRecordDto,
  UpdateMedicationRecordDto,
} from './dto/create-medication-record.dto';
import { MedicationRecordEntity } from './entities/medication-record.entity';

@Api({ path: 'medication-records', tag: '下藥記錄管理' })
export class MedicationRecordController {
  constructor(
    private readonly medicationRecordService: MedicationRecordService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: '新增下藥記錄成功',
    type: MedicationRecordEntity,
  })
  @ApiBadRequestResponse({
    description: '輸入驗證失敗或所屬魚缸不存在',
  })
  create(@Body() createMedicationRecordDto: CreateMedicationRecordDto) {
    return this.medicationRecordService.create(createMedicationRecordDto);
  }

  @Get()
  @ApiOkResponse({
    description: '取得所有下藥記錄列表',
    type: [MedicationRecordEntity],
  })
  findAll() {
    return this.medicationRecordService.findAll();
  }

  @Patch(':id')
  @ApiOkResponse({
    description: '更新下藥記錄成功',
    type: MedicationRecordEntity,
  })
  @ApiBadRequestResponse({
    description: '參數不符合要求或所屬魚缸不存在',
  })
  @ApiNotFoundResponse({
    description: '下藥記錄不存在',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMedicationRecordDto: UpdateMedicationRecordDto,
  ) {
    return this.medicationRecordService.update(id, updateMedicationRecordDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: '刪除下藥記錄成功',
    type: MedicationRecordEntity,
  })
  @ApiNotFoundResponse({
    description: '下藥記錄不存在',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.medicationRecordService.remove(id);
  }
}
