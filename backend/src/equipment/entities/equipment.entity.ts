import { ApiProperty } from '@nestjs/swagger';
import { TimestampsEntity } from '../../common/entities/timestamps.entity';
import { AquariumEntity } from '../../common/entities/aquarium.entity';

export class EquipmentEntity extends TimestampsEntity {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'LED 燈具' })
  name!: string;

  @ApiProperty({ example: '燈具', description: '燈具、過濾器' })
  tag!: string;

  @ApiProperty({ example: '使用中', description: '使用中、閒置、賣掉、丟棄' })
  status!: string;

  @ApiProperty({ required: false, example: 100 })
  price?: number | null;

  @ApiProperty({ required: false })
  notes?: string | null;

  @ApiProperty({ required: false, example: '2025-01-01' })
  purchaseDate?: string | null;

  @ApiProperty({ required: false, example: 1 })
  aquariumId?: number | null;

  @ApiProperty({ type: () => AquariumEntity, required: false })
  aquarium?: AquariumEntity | null;
}
