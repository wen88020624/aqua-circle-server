import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SupplyService } from './supply.service';
import { CreateSupplyDto, UpdateSupplyDto } from './dto/create-supply.dto';

@ApiTags('耗材管理')
@Controller('supplies')
export class SupplyController {
  constructor(private readonly supplyService: SupplyService) {}

  @Post()
  @ApiOperation({ summary: '新增耗材' })
  @ApiResponse({ status: 201, description: '耗材新增成功' })
  @ApiResponse({ status: 400, description: '輸入驗證失敗' })
  create(@Body() createSupplyDto: CreateSupplyDto) {
    return this.supplyService.create(createSupplyDto);
  }

  @Get()
  @ApiOperation({ summary: '查詢所有耗材' })
  @ApiResponse({ status: 200, description: '成功取得耗材列表' })
  findAll() {
    return this.supplyService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新耗材' })
  @ApiParam({ name: 'id', description: '耗材 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '耗材更新成功' })
  @ApiResponse({ status: 404, description: '耗材不存在' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSupplyDto: UpdateSupplyDto) {
    return this.supplyService.update(id, updateSupplyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '刪除耗材' })
  @ApiParam({ name: 'id', description: '耗材 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '耗材刪除成功' })
  @ApiResponse({ status: 404, description: '耗材不存在' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.supplyService.remove(id);
  }
}

