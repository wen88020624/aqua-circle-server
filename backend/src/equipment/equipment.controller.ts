import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto, UpdateEquipmentDto } from './dto/create-equipment.dto';

@ApiTags('設備管理')
@Controller('equipments')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post()
  @ApiOperation({ summary: '新增設備' })
  @ApiResponse({ status: 201, description: '設備新增成功' })
  @ApiResponse({ status: 400, description: '輸入驗證失敗' })
  create(@Body() createEquipmentDto: CreateEquipmentDto) {
    return this.equipmentService.create(createEquipmentDto);
  }

  @Get()
  @ApiOperation({ summary: '查詢所有設備' })
  @ApiResponse({ status: 200, description: '成功取得設備列表' })
  findAll() {
    return this.equipmentService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新設備' })
  @ApiParam({ name: 'id', description: '設備 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '設備更新成功' })
  @ApiResponse({ status: 404, description: '設備不存在' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEquipmentDto: UpdateEquipmentDto) {
    return this.equipmentService.update(id, updateEquipmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '刪除設備' })
  @ApiParam({ name: 'id', description: '設備 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '設備刪除成功' })
  @ApiResponse({ status: 404, description: '設備不存在' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.equipmentService.remove(id);
  }
}

