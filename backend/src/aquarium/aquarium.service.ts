import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAquariumDto } from './dto/create-aquarium.dto';

@Injectable()
export class AquariumService {
  constructor(private prisma: PrismaService) {}

  async create(createAquariumDto: CreateAquariumDto) {
    // 驗證長度、寬度、高度皆 > 0
    if (createAquariumDto.length <= 0 || createAquariumDto.width <= 0 || createAquariumDto.height <= 0) {
      throw new BadRequestException('魚缸建立失敗，長度、寬度、高度皆須 > 0');
    }

    // 驗證狀態不可為空
    if (!createAquariumDto.status || createAquariumDto.status.trim() === '') {
      throw new BadRequestException('魚缸建立失敗，狀態不能為空');
    }

    // 驗證狀態值
    const validStatuses = ['開缸', '穩定', '治療', '閒置'];
    if (!validStatuses.includes(createAquariumDto.status)) {
      throw new BadRequestException(`魚缸建立失敗，狀態必須為：${validStatuses.join('、')}`);
    }

    return this.prisma.aquarium.create({
      data: {
        name: createAquariumDto.name,
        length: createAquariumDto.length,
        width: createAquariumDto.width,
        height: createAquariumDto.height,
        status: createAquariumDto.status,
        setupDate: createAquariumDto.setupDate,
        notes: createAquariumDto.notes,
      },
    });
  }

  async findAll() {
    return this.prisma.aquarium.findMany();
  }

  async remove(id: number) {
    return this.prisma.aquarium.delete({
      where: { id },
    });
  }
}

