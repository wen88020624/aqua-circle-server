import { ApiProperty } from '@nestjs/swagger';

export class CreateWaterQualityRecordDto {
  @ApiProperty({ description: '檢測種類（NH3+NH4、PH、NO3、NO2）', example: 'NH3+NH4' })
  testType!: string;

  @ApiProperty({ description: '檢測日期（格式：YYYY-MM-DD）', example: '2025-01-01' })
  testDate!: string;

  @ApiProperty({ description: '數值', example: 10 })
  value!: number;

  @ApiProperty({ description: '備註', required: false })
  notes?: string;

  @ApiProperty({ description: '所屬魚缸 ID', example: 1 })
  aquariumId!: number;
}

export class UpdateWaterQualityRecordDto {
  @ApiProperty({ description: '檢測種類', required: false })
  testType?: string;

  @ApiProperty({ description: '檢測日期', required: false })
  testDate?: string;

  @ApiProperty({ description: '數值', required: false })
  value?: number;

  @ApiProperty({ description: '備註', required: false })
  notes?: string;

  @ApiProperty({ description: '所屬魚缸 ID', required: false })
  aquariumId?: number;
}

