import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWaterChangeDto, UpdateWaterChangeDto } from './dto/create-water-change.dto';

@Injectable()
export class WaterChangeService {
  constructor(private prisma: PrismaService) {}

  async create(createWaterChangeDto: CreateWaterChangeDto) {
    // 驗證日期不可為空
    if (!createWaterChangeDto.date || createWaterChangeDto.date.trim() === '') {
      throw new BadRequestException('換水記錄的日期不可為空');
    }

    // 驗證換水量不可為空
    if (createWaterChangeDto.waterAmount === undefined || createWaterChangeDto.waterAmount === null) {
      throw new BadRequestException('換水記錄的換水量不可為空');
    }

    // 驗證所屬魚缸不可為空
    if (!createWaterChangeDto.aquariumId) {
      throw new BadRequestException('換水記錄的所屬魚缸不可為空');
    }

    // 驗證魚缸是否存在
    const aquarium = await this.prisma.aquarium.findUnique({
      where: { id: createWaterChangeDto.aquariumId },
    });

    if (!aquarium) {
      throw new BadRequestException('所屬魚缸不存在');
    }

    return this.prisma.waterChange.create({
      data: {
        date: createWaterChangeDto.date,
        waterAmount: createWaterChangeDto.waterAmount,
        notes: createWaterChangeDto.notes,
        aquariumId: createWaterChangeDto.aquariumId,
      },
    });
  }

  async findAll() {
    return this.prisma.waterChange.findMany({
      include: {
        aquarium: true,
      },
    });
  }

  async update(id: number, updateWaterChangeDto: UpdateWaterChangeDto) {
    // 檢查記錄是否存在
    const existing = await this.prisma.waterChange.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('換水記錄不存在');
    }

    // 如果更新魚缸ID，驗證魚缸是否存在
    if (updateWaterChangeDto.aquariumId) {
      const aquarium = await this.prisma.aquarium.findUnique({
        where: { id: updateWaterChangeDto.aquariumId },
      });

      if (!aquarium) {
        throw new BadRequestException('所屬魚缸不存在');
      }
    }

    // 驗證日期不可為空（如果提供）
    if (updateWaterChangeDto.date !== undefined && (updateWaterChangeDto.date === null || updateWaterChangeDto.date.trim() === '')) {
      throw new BadRequestException('換水記錄的日期不可為空');
    }

    // 驗證換水量不可為空（如果提供）
    if (updateWaterChangeDto.waterAmount !== undefined && updateWaterChangeDto.waterAmount === null) {
      throw new BadRequestException('換水記錄的換水量不可為空');
    }

    return this.prisma.waterChange.update({
      where: { id },
      data: {
        date: updateWaterChangeDto.date,
        waterAmount: updateWaterChangeDto.waterAmount,
        notes: updateWaterChangeDto.notes,
        aquariumId: updateWaterChangeDto.aquariumId,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.waterChange.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('換水記錄不存在');
    }

    return this.prisma.waterChange.delete({
      where: { id },
    });
  }
}

