import { Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Api } from '../decorators/api.decorator';
import { SupplyService } from './supply.service';
import { CreateSupplyDto, UpdateSupplyDto } from './dto/create-supply.dto';
import { SupplyEntity } from '../common/entities/supply.entity';

@Api({ path: 'supplies', tag: '耗材管理' })
export class SupplyController {
  constructor(private readonly supplyService: SupplyService) {}

  @Post()
  @ApiCreatedResponse({
    description: '新增耗材成功',
    type: SupplyEntity,
  })
  @ApiBadRequestResponse({
    description: '輸入驗證失敗或所屬魚缸不存在',
  })
  create(@Body() createSupplyDto: CreateSupplyDto) {
    return this.supplyService.create(createSupplyDto);
  }

  @Get()
  @ApiOkResponse({
    description: '取得所有耗材列表',
    type: [SupplyEntity],
  })
  findAll() {
    return this.supplyService.findAll();
  }

  @Patch(':id')
  @ApiOkResponse({
    description: '更新耗材成功',
    type: SupplyEntity,
  })
  @ApiBadRequestResponse({
    description: '參數不符合要求或所屬魚缸不存在',
  })
  @ApiNotFoundResponse({
    description: '耗材不存在',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSupplyDto: UpdateSupplyDto,
  ) {
    return this.supplyService.update(id, updateSupplyDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: '刪除耗材成功',
    type: SupplyEntity,
  })
  @ApiNotFoundResponse({
    description: '耗材不存在',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.supplyService.remove(id);
  }
}
