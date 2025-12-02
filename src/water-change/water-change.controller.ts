import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { WaterChangeService } from './water-change.service';
import { CreateWaterChangeDto, UpdateWaterChangeDto } from './dto/create-water-change.dto';

@ApiTags('換水記錄管理')
@Controller('water-changes')
export class WaterChangeController {
  constructor(private readonly waterChangeService: WaterChangeService) {}

  @Post()
  @ApiOperation({ summary: '新增換水記錄' })
  @ApiResponse({ status: 201, description: '換水記錄新增成功' })
  @ApiResponse({ status: 400, description: '輸入驗證失敗' })
  create(@Body() createWaterChangeDto: CreateWaterChangeDto) {
    return this.waterChangeService.create(createWaterChangeDto);
  }

  @Get()
  @ApiOperation({ summary: '查詢所有換水記錄' })
  @ApiResponse({ status: 200, description: '成功取得換水記錄列表' })
  findAll() {
    return this.waterChangeService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新換水記錄' })
  @ApiParam({ name: 'id', description: '換水記錄 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '換水記錄更新成功' })
  @ApiResponse({ status: 404, description: '換水記錄不存在' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateWaterChangeDto: UpdateWaterChangeDto) {
    return this.waterChangeService.update(id, updateWaterChangeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '刪除換水記錄' })
  @ApiParam({ name: 'id', description: '換水記錄 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '換水記錄刪除成功' })
  @ApiResponse({ status: 404, description: '換水記錄不存在' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.waterChangeService.remove(id);
  }
}

