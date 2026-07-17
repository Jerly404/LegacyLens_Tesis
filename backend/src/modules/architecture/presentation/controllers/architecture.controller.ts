import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ArchitectureService } from '../../application/services/architecture.service';
import { CreateArchitectureDto } from '../../application/dto/create-architecture.dto';
import { UpdateArchitectureDto } from '../../application/dto/update-architecture.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';

@ApiTags('Architecture')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('architecture')
export class ArchitectureController {
  constructor(private readonly service: ArchitectureService) {}

  @Post()
  @Roles('ADMIN', 'DEVELOPER')
  @ApiOperation({ summary: 'Create new architecture record' })
  @ApiResponse({ status: 201, description: 'Created' })
  create(@Body() dto: CreateArchitectureDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'DEVELOPER', 'VIEWER')
  @ApiOperation({ summary: 'Get all architecture records' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'DEVELOPER', 'VIEWER')
  @ApiOperation({ summary: 'Get architecture record by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'DEVELOPER')
  @ApiOperation({ summary: 'Update architecture record' })
  update(@Param('id') id: string, @Body() dto: UpdateArchitectureDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete architecture record' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
