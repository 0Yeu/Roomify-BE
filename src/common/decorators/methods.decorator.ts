// import { SetMetadata } from '@nestjs/common';

// export const Methods = (method: string) => SetMetadata('methods', method);

import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { HierarchyGuard } from '../guards/hierarchy.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Methods(...method: string[]) {
  return applyDecorators(
    SetMetadata('methods', method),
    UseGuards(JwtAuthGuard),
    UseGuards(RolesGuard),
    UseGuards(HierarchyGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' })
  );
}
