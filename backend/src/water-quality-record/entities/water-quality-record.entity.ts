import { ApiProperty } from '@nestjs/swagger';
import { TimestampsEntity } from '../../common/entities/timestamps.entity';
import { AquariumEntity } from '../../common/entities/aquarium.entity';

export class WaterQualityRecordEntity extends TimestampsEntity {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'NH3+NH4', description: 'NH3+NH4、PH、NO3、NO2' })
  testType!: string;

  @ApiProperty({ example: '2025-01-01' })
  testDate!: string;

  @ApiProperty({ example: 0.25 })
  value!: number;

  @ApiProperty({ required: false })
  notes?: string | null;

  @ApiProperty({ example: 1 })
  aquariumId!: number;

  @ApiProperty({ type: () => AquariumEntity, required: false })
  aquarium?: AquariumEntity;
}
