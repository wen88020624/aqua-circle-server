import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplyDto, UpdateSupplyDto } from './dto/create-supply.dto';

@Injectable()
export class SupplyService {
  constructor(private prisma: PrismaService) {}

  async create(createSupplyDto: CreateSupplyDto) {
    // 驗證數量必須 >?（此專案需求：-1 應失敗，但 0 允許並自動變更狀態）
    if (createSupplyDto.quantity < 0) {
      throw new BadRequestException('耗材的數量必須 > 0');
    }

    // 驗證tag不可為空
    if (!createSupplyDto.tag || createSupplyDto.tag.trim() === '') {
      throw new BadRequestException('耗材的tag不可為空');
    }

    // 驗證金額 >= 0
    if (createSupplyDto.price !== undefined && createSupplyDto.price < 0) {
      throw new BadRequestException('耗材的金額必須 >= 0');
    }

    // 根據數量自動設定狀態
    const status = createSupplyDto.quantity > 0 ? '使用中' : '用完';

    // 如果更新魚缸ID，驗證魚缸是否存在
    if (createSupplyDto.aquariumId) {
      const aquarium = await this.prisma.aquarium.findUnique({
        where: { id: createSupplyDto.aquariumId },
      });

      if (!aquarium) {
        throw new BadRequestException('所屬魚缸不存在');
      }
    }

    return this.prisma.supply.create({
      data: {
        name: createSupplyDto.name,
        tag: createSupplyDto.tag,
        quantity: createSupplyDto.quantity,
        status,
        price: createSupplyDto.price,
        notes: createSupplyDto.notes,
        purchaseDate: createSupplyDto.purchaseDate,
        expiryDate: createSupplyDto.expiryDate,
        aquariumId: createSupplyDto.aquariumId,
      },
    });
  }

  async findAll() {
    return this.prisma.supply.findMany({
      include: {
        aquarium: true,
      },
    });
  }

  async update(id: number, updateSupplyDto: UpdateSupplyDto) {
    // 檢查耗材是否存在
    const existing = await this.prisma.supply.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('耗材不存在');
    }

    // 驗證tag不可為空（如果提供）
    if (updateSupplyDto.tag !== undefined && updateSupplyDto.tag.trim() === '') {
      throw new BadRequestException('耗材的tag不可為空');
    }

    // 驗證數量 >= 0（如果提供）
    if (updateSupplyDto.quantity !== undefined && updateSupplyDto.quantity < 0) {
      throw new BadRequestException('耗材的數量必須 >= 0');
    }

    // 驗證金額 >= 0（如果提供）
    if (updateSupplyDto.price !== undefined && updateSupplyDto.price < 0) {
      throw new BadRequestException('耗材的金額必須 >= 0');
    }

    // 根據數量自動更新狀態
    // 規則：只要 DTO 提供了 quantity，就以 quantity 自動計算的狀態為準
    let nextStatus = existing.status;
    if (updateSupplyDto.quantity !== undefined) {
      if (updateSupplyDto.quantity === 0) {
        nextStatus = '用完';
      } else if (updateSupplyDto.quantity > 0 && existing.status === '用完') {
        nextStatus = '使用中';
      }
    } else if (updateSupplyDto.status !== undefined) {
      nextStatus = updateSupplyDto.status;
    }

    // 如果更新魚缸ID，驗證魚缸是否存在
    if (updateSupplyDto.aquariumId) {
      const aquarium = await this.prisma.aquarium.findUnique({
        where: { id: updateSupplyDto.aquariumId },
      });

      if (!aquarium) {
        throw new BadRequestException('所屬魚缸不存在');
      }
    }

    return this.prisma.supply.update({
      where: { id },
      data: {
        name: updateSupplyDto.name,
        tag: updateSupplyDto.tag,
        quantity: updateSupplyDto.quantity,
        status: nextStatus,
        price: updateSupplyDto.price,
        notes: updateSupplyDto.notes,
        purchaseDate: updateSupplyDto.purchaseDate,
        expiryDate: updateSupplyDto.expiryDate,
        aquariumId: updateSupplyDto.aquariumId,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.supply.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('耗材不存在');
    }

    return this.prisma.supply.delete({
      where: { id },
    });
  }
}

