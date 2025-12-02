import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedingRecordDto {
  @ApiProperty({ description: '餵食日期（格式：YYYY-MM-DD）', example: '2025-01-01' })
  date!: string;

  @ApiProperty({ description: '使用的耗材 ID（必須是 tag 為「飼料」的耗材）', example: 1 })
  supplyId!: number;

  @ApiProperty({ description: '備註', required: false, example: '早上餵食' })
  notes?: string;

  @ApiProperty({ description: '所屬魚缸 ID', example: 1 })
  aquariumId!: number;
}

export class UpdateFeedingRecordDto {
  @ApiProperty({ description: '餵食日期（格式：YYYY-MM-DD）', required: false })
  date?: string;

  @ApiProperty({ description: '使用的耗材 ID', required: false })
  supplyId?: number;

  @ApiProperty({ description: '備註', required: false })
  notes?: string;

  @ApiProperty({ description: '所屬魚缸 ID', required: false })
  aquariumId?: number;
}

