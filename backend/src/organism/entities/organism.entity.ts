import { ApiProperty } from '@nestjs/swagger';
import { TimestampsEntity } from '../../common/entities/timestamps.entity';
import { AquariumEntity } from '../../common/entities/aquarium.entity';

export class OrganismEntity extends TimestampsEntity {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: '小丑魚' })
  name!: string;

  @ApiProperty({ example: '上層魚' })
  tag!: string;

  @ApiProperty({ required: false, example: '2025-01-01' })
  purchaseDate?: string | null;

  @ApiProperty({ required: false, example: 100 })
  price?: number | null;

  @ApiProperty({ required: false, example: '正常' })
  healthStatus?: string | null;

  @ApiProperty({ required: false, example: '雄' })
  gender?: string | null;

  @ApiProperty({ required: false, example: 10 })
  length?: number | null;

  @ApiProperty({ required: false })
  notes?: string | null;

  @ApiProperty({ example: 1 })
  aquariumId!: number;

  @ApiProperty({ type: () => AquariumEntity, required: false })
  aquarium?: AquariumEntity;
}
