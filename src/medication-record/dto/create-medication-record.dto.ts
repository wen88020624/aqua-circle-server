import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicationRecordDto {
  @ApiProperty({ description: '下藥名稱', example: '魚膚寧' })
  medicationName!: string;

  @ApiProperty({ description: 'tag（抗生素、病毒藥）', example: '抗生素' })
  tag!: string;

  @ApiProperty({ description: '下藥的量（mg/L）', example: 10 })
  dosage!: number;

  @ApiProperty({ description: '下藥日期（格式：YYYY-MM-DD）', example: '2025-01-01' })
  date!: string;

  @ApiProperty({ description: '備註', required: false })
  notes?: string;

  @ApiProperty({ description: '所屬魚缸 ID', example: 1 })
  aquariumId!: number;
}

export class UpdateMedicationRecordDto {
  @ApiProperty({ description: '下藥名稱', required: false })
  medicationName?: string;

  @ApiProperty({ description: 'tag', required: false })
  tag?: string;

  @ApiProperty({ description: '下藥的量（mg/L）', required: false })
  dosage?: number;

  @ApiProperty({ description: '下藥日期', required: false })
  date?: string;

  @ApiProperty({ description: '備註', required: false })
  notes?: string;

  @ApiProperty({ description: '所屬魚缸 ID', required: false })
  aquariumId?: number;
}

