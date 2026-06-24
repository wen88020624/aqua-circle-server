import { applyDecorators, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function Api(options: { path: string; tag: string }) {
  return applyDecorators(Controller(options.path), ApiTags(options.tag));
}
