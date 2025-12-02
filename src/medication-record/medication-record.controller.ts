import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MedicationRecordService } from './medication-record.service';
import { CreateMedicationRecordDto, UpdateMedicationRecordDto } from './dto/create-medication-record.dto';

@ApiTags('下藥記錄管理')
@Controller('medication-records')
export class MedicationRecordController {
  constructor(private readonly medicationRecordService: MedicationRecordService) {}

  @Post()
  @ApiOperation({ summary: '新增下藥記錄' })
  @ApiResponse({ status: 201, description: '下藥記錄新增成功' })
  @ApiResponse({ status: 400, description: '輸入驗證失敗' })
  create(@Body() createMedicationRecordDto: CreateMedicationRecordDto) {
    return this.medicationRecordService.create(createMedicationRecordDto);
  }

  @Get()
  @ApiOperation({ summary: '查詢所有下藥記錄' })
  @ApiResponse({ status: 200, description: '成功取得下藥記錄列表' })
  findAll() {
    return this.medicationRecordService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新下藥記錄' })
  @ApiParam({ name: 'id', description: '下藥記錄 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '下藥記錄更新成功' })
  @ApiResponse({ status: 404, description: '下藥記錄不存在' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMedicationRecordDto: UpdateMedicationRecordDto) {
    return this.medicationRecordService.update(id, updateMedicationRecordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '刪除下藥記錄' })
  @ApiParam({ name: 'id', description: '下藥記錄 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '下藥記錄刪除成功' })
  @ApiResponse({ status: 404, description: '下藥記錄不存在' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.medicationRecordService.remove(id);
  }
}

