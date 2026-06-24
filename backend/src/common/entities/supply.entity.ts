import { ApiProperty } from '@nestjs/swagger';
import { TimestampsEntity } from './timestamps.entity';
import { AquariumEntity } from './aquarium.entity';

export class SupplyEntity extends TimestampsEntity {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: '飼料' })
  name!: string;

  @ApiProperty({ example: '飼料', description: '藥品、濾材、飼料' })
  tag!: string;

  @ApiProperty({ example: 10 })
  quantity!: number;

  @ApiProperty({ example: '使用中', description: '使用中、用完、丟棄' })
  status!: string;

  @ApiProperty({ required: false, example: 100 })
  price?: number | null;

  @ApiProperty({ required: false })
  notes?: string | null;

  @ApiProperty({ required: false, example: '2025-01-01' })
  purchaseDate?: string | null;

  @ApiProperty({ required: false, example: '2026-01-01' })
  expiryDate?: string | null;

  @ApiProperty({ required: false, example: 1 })
  aquariumId?: number | null;

  @ApiProperty({ type: () => AquariumEntity, required: false })
  aquarium?: AquariumEntity | null;
}
