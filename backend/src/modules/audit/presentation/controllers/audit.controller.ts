import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from '../../application/services/audit.service';
import { CreateAuditDto } from '../../application/dto/create-audit.dto';
import { UpdateAuditDto } from '../../application/dto/update-audit.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';

@ApiTags('Audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly service: AuditService) {}

  @Post()
  @Roles('ADMIN', 'DEVELOPER')
  @ApiOperation({ summary: 'Create new audit record' })
  @ApiResponse({ status: 201, description: 'Created' })
  create(@Body() dto: CreateAuditDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'DEVELOPER', 'VIEWER')
  @ApiOperation({ summary: 'Get all audit records' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'DEVELOPER', 'VIEWER')
  @ApiOperation({ summary: 'Get audit record by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'DEVELOPER')
  @ApiOperation({ summary: 'Update audit record' })
  update(@Param('id') id: string, @Body() dto: UpdateAuditDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete audit record' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
