import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrganismService } from './organism.service';
import { CreateOrganismDto, UpdateOrganismDto } from './dto/create-organism.dto';

@ApiTags('生物管理')
@Controller('organisms')
export class OrganismController {
  constructor(private readonly organismService: OrganismService) {}

  @Post()
  @ApiOperation({ summary: '新增生物' })
  @ApiResponse({ status: 201, description: '生物新增成功' })
  @ApiResponse({ status: 400, description: '輸入驗證失敗' })
  create(@Body() createOrganismDto: CreateOrganismDto) {
    return this.organismService.create(createOrganismDto);
  }

  @Get()
  @ApiOperation({ summary: '查詢所有生物' })
  @ApiResponse({ status: 200, description: '成功取得生物列表' })
  findAll() {
    return this.organismService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新生物' })
  @ApiParam({ name: 'id', description: '生物 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '生物更新成功' })
  @ApiResponse({ status: 404, description: '生物不存在' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOrganismDto: UpdateOrganismDto) {
    return this.organismService.update(id, updateOrganismDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '刪除生物' })
  @ApiParam({ name: 'id', description: '生物 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '生物刪除成功' })
  @ApiResponse({ status: 404, description: '生物不存在' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organismService.remove(id);
  }
}

