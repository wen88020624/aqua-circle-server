import { Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Api } from '../decorators/api.decorator';
import { AquariumService } from './aquarium.service';
import { CreateAquariumDto } from './dto/create-aquarium.dto';
import { AquariumEntity } from '../common/entities/aquarium.entity';

@Api({ path: 'aquariums', tag: '魚缸管理' })
export class AquariumController {
  constructor(private readonly aquariumService: AquariumService) {}

  @Post()
  @ApiCreatedResponse({
    description: '建立魚缸成功',
    type: AquariumEntity,
  })
  @ApiBadRequestResponse({
    description: '名稱、尺寸、狀態或開缸日期不符合要求',
  })
  create(@Body() createAquariumDto: CreateAquariumDto) {
    return this.aquariumService.create(createAquariumDto);
  }

  @Get()
  @ApiOkResponse({
    description: '取得所有魚缸列表',
    type: [AquariumEntity],
  })
  findAll() {
    return this.aquariumService.findAll();
  }

  @Delete(':id')
  @ApiOkResponse({
    description: '刪除魚缸成功',
    type: AquariumEntity,
  })
  @ApiNotFoundResponse({
    description: '魚缸不存在',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.aquariumService.remove(id);
  }
}
