import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganismDto, UpdateOrganismDto } from './dto/create-organism.dto';

@Injectable()
export class OrganismService {
  constructor(private prisma: PrismaService) {}

  async create(createOrganismDto: CreateOrganismDto) {
    // 驗證名稱不可為空
    if (!createOrganismDto.name || createOrganismDto.name.trim() === '') {
      throw new BadRequestException('生物的名稱不可為空');
    }

    // 驗證tag不可為空
    if (!createOrganismDto.tag || createOrganismDto.tag.trim() === '') {
      throw new BadRequestException('生物的tag不可為空');
    }

    // 驗證金額 >= 0
    if (createOrganismDto.price !== undefined && createOrganismDto.price < 0) {
      throw new BadRequestException('生物的金額必須 >= 0');
    }

    // 驗證長度 >= 0
    if (createOrganismDto.length !== undefined && createOrganismDto.length < 0) {
      throw new BadRequestException('生物的長度必須 >= 0');
    }

    // 驗證所屬魚缸必須存在
    const aquarium = await this.prisma.aquarium.findUnique({
      where: { id: createOrganismDto.aquariumId },
    });

    if (!aquarium) {
      throw new BadRequestException('所屬魚缸不存在於系統中');
    }

    return this.prisma.organism.create({
      data: {
        name: createOrganismDto.name,
        tag: createOrganismDto.tag,
        purchaseDate: createOrganismDto.purchaseDate,
        price: createOrganismDto.price,
        healthStatus: createOrganismDto.healthStatus,
        gender: createOrganismDto.gender,
        length: createOrganismDto.length,
        notes: createOrganismDto.notes,
        aquariumId: createOrganismDto.aquariumId,
      },
    });
  }

  async findAll() {
    return this.prisma.organism.findMany({
      include: {
        aquarium: true,
      },
    });
  }

  async update(id: number, updateOrganismDto: UpdateOrganismDto) {
    // 檢查生物是否存在
    const existing = await this.prisma.organism.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('生物不存在');
    }

    // 如果更新名稱，驗證不可為空
    if (updateOrganismDto.name !== undefined && updateOrganismDto.name.trim() === '') {
      throw new BadRequestException('生物的名稱不可為空');
    }

    // 如果更新tag，驗證不可為空
    if (updateOrganismDto.tag !== undefined && updateOrganismDto.tag.trim() === '') {
      throw new BadRequestException('生物的tag不可為空');
    }

    // 驗證金額 >= 0
    if (updateOrganismDto.price !== undefined && updateOrganismDto.price < 0) {
      throw new BadRequestException('生物的金額必須 >= 0');
    }

    // 驗證長度 >= 0
    if (updateOrganismDto.length !== undefined && updateOrganismDto.length < 0) {
      throw new BadRequestException('生物的長度必須 >= 0');
    }

    // 如果更新魚缸ID，驗證魚缸是否存在
    if (updateOrganismDto.aquariumId) {
      const aquarium = await this.prisma.aquarium.findUnique({
        where: { id: updateOrganismDto.aquariumId },
      });

      if (!aquarium) {
        throw new BadRequestException('所屬魚缸不存在於系統中');
      }
    }

    return this.prisma.organism.update({
      where: { id },
      data: {
        name: updateOrganismDto.name,
        tag: updateOrganismDto.tag,
        purchaseDate: updateOrganismDto.purchaseDate,
        price: updateOrganismDto.price,
        healthStatus: updateOrganismDto.healthStatus,
        gender: updateOrganismDto.gender,
        length: updateOrganismDto.length,
        notes: updateOrganismDto.notes,
        aquariumId: updateOrganismDto.aquariumId,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.organism.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('生物不存在');
    }

    return this.prisma.organism.delete({
      where: { id },
    });
  }
}

