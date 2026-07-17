import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from '../../application/services/reports.service';
import { CreateReportsDto } from '../../application/dto/create-reports.dto';
import { UpdateReportsDto } from '../../application/dto/update-reports.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Post()
  @Roles('ADMIN', 'DEVELOPER')
  @ApiOperation({ summary: 'Create new reports record' })
  @ApiResponse({ status: 201, description: 'Created' })
  create(@Body() dto: CreateReportsDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'DEVELOPER', 'VIEWER')
  @ApiOperation({ summary: 'Get all reports records' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'DEVELOPER', 'VIEWER')
  @ApiOperation({ summary: 'Get reports record by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'DEVELOPER')
  @ApiOperation({ summary: 'Update reports record' })
  update(@Param('id') id: string, @Body() dto: UpdateReportsDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete reports record' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
