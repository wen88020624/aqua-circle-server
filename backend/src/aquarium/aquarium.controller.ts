import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AquariumService } from './aquarium.service';
import { CreateAquariumDto } from './dto/create-aquarium.dto';

@ApiTags('魚缸管理')
@Controller('aquariums')
export class AquariumController {
  constructor(private readonly aquariumService: AquariumService) {}

  @Post()
  @ApiOperation({ summary: '創建新魚缸' })
  @ApiResponse({ status: 201, description: '魚缸創建成功' })
  create(@Body() createAquariumDto: CreateAquariumDto) {
    return this.aquariumService.create(createAquariumDto);
  }

  @Get()
  @ApiOperation({ summary: '取得所有魚缸列表' })
  @ApiResponse({ status: 200, description: '成功取得魚缸列表' })
  findAll() {
    return this.aquariumService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: '刪除魚缸' })
  @ApiParam({ name: 'id', description: '魚缸 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '成功刪除魚缸' })
  @ApiResponse({ status: 404, description: '魚缸不存在' })
  remove(@Param('id') id: string) {
    return this.aquariumService.remove(+id);
  }
}

