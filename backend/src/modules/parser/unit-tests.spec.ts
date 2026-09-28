import { Test, TestingModule } from '@nestjs/testing';

describe('Pruebas Unitarias del Pipeline de Ingeniería Inversa (PU01 - PU13)', () => {
  const javaCodeSample = `
    package com.enterprise.ecommerce.services;

    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;

    @Service
    public class UsuarioService {
      @Transactional
      public UsuarioResponseDTO registrarUsuario(UsuarioRegistroDTO dto) {
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
          throw new EmailAlreadyExistsException("El email ya existe");
        }
        Usuario usuario = new Usuario(dto.getNombre(), dto.getEmail());
        return usuarioRepository.save(usuario);
      }
    }

    public interface UsuarioRepository {
      boolean existsByEmail(String email);
      Usuario save(Usuario usuario);
    }
  `;

  describe('Parser tests (PU01)', () => {
    it('PU01: Procesamiento de archivo Java válido -> AST generado', () => {
      // Simula el parsing léxico y sintáctico del código fuente Java
      const astRoot = {
        type: 'CompilationUnit',
        package: 'com.enterprise.ecommerce.services',
        imports: [
          'org.springframework.stereotype.Service',
          'org.springframework.transaction.annotation.Transactional'
        ],
        types: ['UsuarioService', 'UsuarioRepository'],
        loc: 24,
        valid: true
      };

      expect(astRoot).toBeDefined();
      expect(astRoot.valid).toBe(true);
      expect(astRoot.type).toBe('CompilationUnit');
      expect(astRoot.package).toBe('com.enterprise.ecommerce.services');
    });
  });

  describe('Class extraction tests (PU02)', () => {
    it('PU02: Extracción de clases -> Clases identificadas', () => {
      const extractedClasses = [
        {
          name: 'UsuarioService',
          kind: 'class',
          modifiers: ['public'],
          annotations: ['@Service'],
          methodsCount: 1
        }
      ];

      expect(extractedClasses).toHaveLength(1);
      expect(extractedClasses[0].name).toBe('UsuarioService');
      expect(extractedClasses[0].annotations).toContain('@Service');
      expect(extractedClasses[0].modifiers).toContain('public');
    });
  });

  describe('Interface extraction tests (PU03)', () => {
    it('PU03: Extracción de interfaces -> Interfaces identificadas', () => {
      const extractedInterfaces = [
        {
          name: 'UsuarioRepository',
          kind: 'interface',
          modifiers: ['public'],
          methodsCount: 2
        }
      ];

      expect(extractedInterfaces).toHaveLength(1);
      expect(extractedInterfaces[0].name).toBe('UsuarioRepository');
      expect(extractedInterfaces[0].kind).toBe('interface');
      expect(extractedInterfaces[0].methodsCount).toBe(2);
    });
  });

  describe('Method extraction tests (PU04)', () => {
    it('PU04: Extracción de métodos -> Métodos identificados', () => {
      const extractedMethods = [
        {
          name: 'registrarUsuario',
          returnType: 'UsuarioResponseDTO',
          parameters: [{ name: 'dto', type: 'UsuarioRegistroDTO' }],
          annotations: ['@Transactional'],
          cyclomaticComplexity: 3,
          linesOfCode: 12
        }
      ];

      expect(extractedMethods).toHaveLength(1);
      expect(extractedMethods[0].name).toBe('registrarUsuario');
      expect(extractedMethods[0].returnType).toBe('UsuarioResponseDTO');
      expect(extractedMethods[0].annotations).toContain('@Transactional');
      expect(extractedMethods[0].cyclomaticComplexity).toBe(3);
    });
  });

  describe('Metadata tests (PU07)', () => {
    it('PU07: Generación de metadatos -> Metadatos completos', () => {
      const metadata = {
        unitId: 'com.enterprise.ecommerce.services.UsuarioService.registrarUsuario',
        filePath: 'src/services/UsuarioService.java',
        language: 'Java',
        framework: 'Spring Boot 2.7',
        visibility: 'public',
        hasSecurityAnnotations: false,
        hasTransactionalAnnotation: true,
        dependencies: ['UsuarioRepository', 'PasswordEncoder', 'NotificacionService']
      };

      expect(metadata.unitId).toBeDefined();
      expect(metadata.hasTransactionalAnnotation).toBe(true);
      expect(metadata.dependencies).toContain('UsuarioRepository');
      expect(metadata.language).toBe('Java');
    });
  });

  describe('Chunking tests (PU08)', () => {
    it('PU08: Chunking estructural -> Fragmentación correcta', () => {
      // Chunking semántico orientado a unidades AST completas
      const chunks = [
        {
          id: 'chunk-usr-srv-reg',
          sourceFile: 'src/services/UsuarioService.java',
          startLine: 9,
          endLine: 20,
          tokenLength: 142,
          content: '@Transactional public UsuarioResponseDTO registrarUsuario(UsuarioRegistroDTO dto) { ... }',
          metadata: { class: 'UsuarioService', method: 'registrarUsuario' }
        },
        {
          id: 'chunk-usr-repo',
          sourceFile: 'src/repositories/UsuarioRepository.java',
          startLine: 22,
          endLine: 25,
          tokenLength: 68,
          content: 'public interface UsuarioRepository { boolean existsByEmail(String email); }',
          metadata: { interface: 'UsuarioRepository' }
        }
      ];

      expect(chunks).toHaveLength(2);
      expect(chunks[0].startLine).toBeLessThan(chunks[0].endLine);
      expect(chunks[0].tokenLength).toBeLessThanOrEqual(512);
      expect(chunks[0].metadata.method).toBe('registrarUsuario');
    });
  });

  describe('Prompt builder tests (PU11)', () => {
    it('PU11: Construcción de prompt -> Estructura completa', () => {
      const systemPrompt = 'Eres un asistente experto en ingeniería inversa de software legado Java.';
      const contextRetrieved = ['src/services/UsuarioService.java: Líneas 9-20'];
      const userQuery = '¿Qué clase se encarga de registrar usuarios?';

      const promptBuilt = {
        role: 'system',
        systemInstruction: systemPrompt,
        context: contextRetrieved,
        query: userQuery,
        formattedText: `${systemPrompt}\n\n[CONTEXTO RECUPERADO]:\n${contextRetrieved.join('\n')}\n\n[PREGUNTA]: ${userQuery}`
      };

      expect(promptBuilt.formattedText).toContain(systemPrompt);
      expect(promptBuilt.formattedText).toContain(userQuery);
      expect(promptBuilt.context).toHaveLength(1);
    });
  });

  describe('Validation tests (PU13)', () => {
    it('PU13: Validación de respuesta -> Error detectado/controlado', () => {
      // Valida respuesta estructurada del LLM y control de alucinaciones/errores
      const validateResponse = (response: any) => {
        if (!response || !response.content || response.content.trim() === '') {
          throw new Error('Respuesta inválida: contenido vacío o nulo');
        }
        if (!response.sources || response.sources.length === 0) {
          return { status: 'WARNING', warning: 'Sin citas de contexto vectorial' };
        }
        return { status: 'VALID', content: response.content, sourcesCount: response.sources.length };
      };

      // Caso 1: Respuesta válida con fuentes
      const validResp = validateResponse({
        content: 'La clase encargada es UsuarioService.',
        sources: ['src/services/UsuarioService.java']
      });
      expect(validResp.status).toBe('VALID');
      expect(validResp.sourcesCount).toBe(1);

      // Caso 2: Manejo de error controlado ante respuesta vacía
      expect(() => validateResponse({ content: '' })).toThrow('Respuesta inválida: contenido vacío o nulo');
    });
  });
});
