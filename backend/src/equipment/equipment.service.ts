import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEquipmentDto, UpdateEquipmentDto } from './dto/create-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(private prisma: PrismaService) {}

  async create(createEquipmentDto: CreateEquipmentDto) {
    // 驗證名稱不可為空
    if (!createEquipmentDto.name || createEquipmentDto.name.trim() === '') {
      throw new BadRequestException('設備的名稱不可為空');
    }

    // 驗證狀態不可為空
    if (!createEquipmentDto.status || createEquipmentDto.status.trim() === '') {
      throw new BadRequestException('設備的狀態不可為空');
    }

    // 驗證tag不可為空
    if (!createEquipmentDto.tag || createEquipmentDto.tag.trim() === '') {
      throw new BadRequestException('設備的tag不可為空');
    }

    // 驗證金額 >= 0
    if (createEquipmentDto.price !== undefined && createEquipmentDto.price < 0) {
      throw new BadRequestException('設備的金額必須 >= 0');
    }

    // 如果更新魚缸ID，驗證魚缸是否存在
    if (createEquipmentDto.aquariumId) {
      const aquarium = await this.prisma.aquarium.findUnique({
        where: { id: createEquipmentDto.aquariumId },
      });

      if (!aquarium) {
        throw new BadRequestException('所屬魚缸不存在');
      }
    }

    return this.prisma.equipment.create({
      data: {
        name: createEquipmentDto.name,
        tag: createEquipmentDto.tag,
        status: createEquipmentDto.status,
        price: createEquipmentDto.price,
        notes: createEquipmentDto.notes,
        purchaseDate: createEquipmentDto.purchaseDate,
        aquariumId: createEquipmentDto.aquariumId,
      },
    });
  }

  async findAll() {
    return this.prisma.equipment.findMany({
      include: {
        aquarium: true,
      },
    });
  }

  async update(id: number, updateEquipmentDto: UpdateEquipmentDto) {
    const existing = await this.prisma.equipment.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('設備不存在');
    }

    // 驗證名稱不可為空（如果提供）
    if (updateEquipmentDto.name !== undefined && updateEquipmentDto.name.trim() === '') {
      throw new BadRequestException('設備的名稱不可為空');
    }

    // 驗證狀態不可為空（如果提供）
    if (updateEquipmentDto.status !== undefined && updateEquipmentDto.status.trim() === '') {
      throw new BadRequestException('設備的狀態不可為空');
    }

    // 驗證tag不可為空（如果提供）
    if (updateEquipmentDto.tag !== undefined && updateEquipmentDto.tag.trim() === '') {
      throw new BadRequestException('設備的tag不可為空');
    }

    // 驗證金額 >= 0（如果提供）
    if (updateEquipmentDto.price !== undefined && updateEquipmentDto.price < 0) {
      throw new BadRequestException('設備的金額必須 >= 0');
    }

    // 如果更新魚缸ID，驗證魚缸是否存在
    if (updateEquipmentDto.aquariumId) {
      const aquarium = await this.prisma.aquarium.findUnique({
        where: { id: updateEquipmentDto.aquariumId },
      });

      if (!aquarium) {
        throw new BadRequestException('所屬魚缸不存在');
      }
    }

    return this.prisma.equipment.update({
      where: { id },
      data: {
        name: updateEquipmentDto.name,
        tag: updateEquipmentDto.tag,
        status: updateEquipmentDto.status,
        price: updateEquipmentDto.price,
        notes: updateEquipmentDto.notes,
        purchaseDate: updateEquipmentDto.purchaseDate,
        aquariumId: updateEquipmentDto.aquariumId,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.equipment.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('設備不存在');
    }

    return this.prisma.equipment.delete({
      where: { id },
    });
  }
}

