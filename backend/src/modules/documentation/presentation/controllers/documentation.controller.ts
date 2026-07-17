import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentationService } from '../../application/services/documentation.service';
import { CreateDocumentationDto } from '../../application/dto/create-documentation.dto';
import { UpdateDocumentationDto } from '../../application/dto/update-documentation.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';

@ApiTags('Documentation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documentation')
export class DocumentationController {
  constructor(private readonly service: DocumentationService) {}

  @Post()
  @Roles('ADMIN', 'DEVELOPER')
  @ApiOperation({ summary: 'Create new documentation record' })
  @ApiResponse({ status: 201, description: 'Created' })
  create(@Body() dto: CreateDocumentationDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'DEVELOPER', 'VIEWER')
  @ApiOperation({ summary: 'Get all documentation records' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'DEVELOPER', 'VIEWER')
  @ApiOperation({ summary: 'Get documentation record by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'DEVELOPER')
  @ApiOperation({ summary: 'Update documentation record' })
  update(@Param('id') id: string, @Body() dto: UpdateDocumentationDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete documentation record' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
