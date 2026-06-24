import { ApiProperty } from '@nestjs/swagger';
import { TimestampsEntity } from '../../common/entities/timestamps.entity';
import { AquariumEntity } from '../../common/entities/aquarium.entity';
import { SupplyEntity } from '../../common/entities/supply.entity';

export class FeedingRecordEntity extends TimestampsEntity {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: '2025-01-01' })
  date!: string;

  @ApiProperty({ example: 1, description: '使用的耗材 ID' })
  supplyId!: number;

  @ApiProperty({ required: false })
  notes?: string | null;

  @ApiProperty({ example: 1 })
  aquariumId!: number;

  @ApiProperty({ type: () => SupplyEntity, required: false })
  supply?: SupplyEntity;

  @ApiProperty({ type: () => AquariumEntity, required: false })
  aquarium?: AquariumEntity;

  @ApiProperty({
    required: false,
    description: '建立時若耗材數量不足等情況的警告訊息',
    example: '耗材數量已低於建議值',
  })
  warning?: string;
}
