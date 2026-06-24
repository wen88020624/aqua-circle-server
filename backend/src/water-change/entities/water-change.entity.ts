import { ApiProperty } from '@nestjs/swagger';
import { TimestampsEntity } from '../../common/entities/timestamps.entity';
import { AquariumEntity } from '../../common/entities/aquarium.entity';

export class WaterChangeEntity extends TimestampsEntity {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: '2025-01-01' })
  date!: string;

  @ApiProperty({
    example: 0.5,
    description: '換水量比例（0.5 表示 1/2、1.0 表示全換）',
  })
  waterAmount!: number;

  @ApiProperty({ required: false })
  notes?: string | null;

  @ApiProperty({ example: 1 })
  aquariumId!: number;

  @ApiProperty({ type: () => AquariumEntity, required: false })
  aquarium?: AquariumEntity;
}
