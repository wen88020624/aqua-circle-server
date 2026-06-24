import { Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Api } from '../decorators/api.decorator';
import { WaterChangeService } from './water-change.service';
import { CreateWaterChangeDto, UpdateWaterChangeDto } from './dto/create-water-change.dto';
import { WaterChangeEntity } from './entities/water-change.entity';

@Api({ path: 'water-changes', tag: '換水記錄管理' })
export class WaterChangeController {
  constructor(private readonly waterChangeService: WaterChangeService) {}

  @Post()
  @ApiCreatedResponse({
    description: '新增換水記錄成功',
    type: WaterChangeEntity,
  })
  @ApiBadRequestResponse({
    description: '輸入驗證失敗或所屬魚缸不存在',
  })
  create(@Body() createWaterChangeDto: CreateWaterChangeDto) {
    return this.waterChangeService.create(createWaterChangeDto);
  }

  @Get()
  @ApiOkResponse({
    description: '取得所有換水記錄列表',
    type: [WaterChangeEntity],
  })
  findAll() {
    return this.waterChangeService.findAll();
  }

  @Patch(':id')
  @ApiOkResponse({
    description: '更新換水記錄成功',
    type: WaterChangeEntity,
  })
  @ApiBadRequestResponse({
    description: '參數不符合要求或所屬魚缸不存在',
  })
  @ApiNotFoundResponse({
    description: '換水記錄不存在',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWaterChangeDto: UpdateWaterChangeDto,
  ) {
    return this.waterChangeService.update(id, updateWaterChangeDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: '刪除換水記錄成功',
    type: WaterChangeEntity,
  })
  @ApiNotFoundResponse({
    description: '換水記錄不存在',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.waterChangeService.remove(id);
  }
}
