import { ApiProperty } from '@nestjs/swagger';

export class TimestampsEntity {
  @ApiProperty({ type: String, format: 'date-time', example: '2025-01-01T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time', example: '2025-01-01T00:00:00.000Z' })
  updatedAt!: Date;
}
