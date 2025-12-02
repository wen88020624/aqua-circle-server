import { ApiProperty } from '@nestjs/swagger';

export class CreateWaterChangeDto {
  @ApiProperty({ description: '換水日期（格式：YYYY-MM-DD）', example: '2025-01-01' })
  date!: string;

  @ApiProperty({ description: '換水量（比例：0.5 表示 1/2、0.33 表示 1/3、1.0 表示全換）', example: 0.5 })
  waterAmount!: number;

  @ApiProperty({ description: '備註', required: false, example: '定期換水' })
  notes?: string;

  @ApiProperty({ description: '所屬魚缸 ID', example: 1 })
  aquariumId!: number;
}

export class UpdateWaterChangeDto {
  @ApiProperty({ description: '換水日期（格式：YYYY-MM-DD）', example: '2025-01-01', required: false })
  date?: string;

  @ApiProperty({ description: '換水量（比例：0.5 表示 1/2、0.33 表示 1/3、1.0 表示全換）', example: 0.5, required: false })
  waterAmount?: number;

  @ApiProperty({ description: '備註', required: false })
  notes?: string;

  @ApiProperty({ description: '所屬魚缸 ID', example: 1, required: false })
  aquariumId?: number;
}

