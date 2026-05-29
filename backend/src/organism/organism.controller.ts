import { Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Api } from '../decorators/api.decorator';
import { OrganismService } from './organism.service';
import { CreateOrganismDto, UpdateOrganismDto } from './dto/create-organism.dto';
import { OrganismEntity } from './entities/organism.entity';

@Api({ path: 'organisms', tag: '生物管理' })
export class OrganismController {
  constructor(private readonly organismService: OrganismService) {}

  @Post()
  @ApiCreatedResponse({
    description: '新增生物成功',
    type: OrganismEntity,
  })
  @ApiBadRequestResponse({
    description: '輸入驗證失敗或所屬魚缸不存在',
  })
  create(@Body() createOrganismDto: CreateOrganismDto) {
    return this.organismService.create(createOrganismDto);
  }

  @Get()
  @ApiOkResponse({
    description: '取得所有生物列表',
    type: [OrganismEntity],
  })
  findAll() {
    return this.organismService.findAll();
  }

  @Patch(':id')
  @ApiOkResponse({
    description: '更新生物成功',
    type: OrganismEntity,
  })
  @ApiBadRequestResponse({
    description: '參數不符合要求或所屬魚缸不存在',
  })
  @ApiNotFoundResponse({
    description: '生物不存在',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganismDto: UpdateOrganismDto,
  ) {
    return this.organismService.update(id, updateOrganismDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: '刪除生物成功',
    type: OrganismEntity,
  })
  @ApiNotFoundResponse({
    description: '生物不存在',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organismService.remove(id);
  }
}
