import { ApiProperty } from '@nestjs/swagger';
import { TimestampsEntity } from '../../common/entities/timestamps.entity';
import { AquariumEntity } from '../../common/entities/aquarium.entity';

export class MedicationRecordEntity extends TimestampsEntity {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: '魚膚寧' })
  name!: string;

  @ApiProperty({ example: '抗生素', description: '抗生素、病毒藥' })
  tag!: string;

  @ApiProperty({ example: 10, description: '下藥量（mg/L）' })
  dosage!: number;

  @ApiProperty({ example: '2025-01-01' })
  date!: string;

  @ApiProperty({ required: false })
  notes?: string | null;

  @ApiProperty({ example: 1 })
  aquariumId!: number;

  @ApiProperty({ type: () => AquariumEntity, required: false })
  aquarium?: AquariumEntity;
}
