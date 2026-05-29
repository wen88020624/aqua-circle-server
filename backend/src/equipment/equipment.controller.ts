import { Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Api } from '../decorators/api.decorator';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto, UpdateEquipmentDto } from './dto/create-equipment.dto';
import { EquipmentEntity } from './entities/equipment.entity';

@Api({ path: 'equipments', tag: '設備管理' })
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post()
  @ApiCreatedResponse({
    description: '新增設備成功',
    type: EquipmentEntity,
  })
  @ApiBadRequestResponse({
    description: '輸入驗證失敗或所屬魚缸不存在',
  })
  create(@Body() createEquipmentDto: CreateEquipmentDto) {
    return this.equipmentService.create(createEquipmentDto);
  }

  @Get()
  @ApiOkResponse({
    description: '取得所有設備列表',
    type: [EquipmentEntity],
  })
  findAll() {
    return this.equipmentService.findAll();
  }

  @Patch(':id')
  @ApiOkResponse({
    description: '更新設備成功',
    type: EquipmentEntity,
  })
  @ApiBadRequestResponse({
    description: '參數不符合要求或所屬魚缸不存在',
  })
  @ApiNotFoundResponse({
    description: '設備不存在',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEquipmentDto: UpdateEquipmentDto,
  ) {
    return this.equipmentService.update(id, updateEquipmentDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: '刪除設備成功',
    type: EquipmentEntity,
  })
  @ApiNotFoundResponse({
    description: '設備不存在',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.equipmentService.remove(id);
  }
}
