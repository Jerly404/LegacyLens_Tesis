#!/usr/bin/env bash

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m'

echo -e "${CYAN}====================================================${NC}"
echo -e "${CYAN}  Iniciando CodeLens / LegacyAI Enterprise Platform ${NC}"
echo -e "${CYAN}====================================================${NC}"

# 1. Comprobar y levantar servicios de infraestructura con Docker
echo -e "\n${BLUE}[1/3] Verificando Docker y servicios de soporte...${NC}"
if docker info >/dev/null 2>&1; then
  echo -e "${GREEN}✓ Docker daemon está activo.${NC}"
  echo -e "Levantando contenedores de infraestructura (Postgres, Redis, MinIO, Qdrant, Ollama)..."
  docker compose up -d postgres redis minio qdrant ollama || true
  echo -e "${GREEN}✓ Contenedores de infraestructura iniciados.${NC}"
else
  echo -e "${YELLOW}⚠ El daemon de Docker no está activo.${NC}"
  echo -e "${YELLOW}  (Para iniciar docker: sudo systemctl start docker)${NC}"
  echo -e "${YELLOW}  Continuando con la ejecución de Backend y Frontend...${NC}"
fi

# 2. Compilar paquete compartido @codelens/shared
echo -e "\n${BLUE}[2/3] Compilando @codelens/shared...${NC}"
npm run build:shared

# 3. Iniciar Backend y Frontend en paralelo con recarga en caliente
echo -e "\n${BLUE}[3/3] Iniciando Backend (NestJS :3000) y Frontend (Angular 20 :4200)...${NC}"
echo -e "${GREEN}✓ Frontend disponible en: ${CYAN}http://localhost:4200${NC}"
echo -e "${GREEN}✓ Backend API en:        ${CYAN}http://localhost:3000/api${NC}"
echo -e "${GREEN}✓ Swagger Docs en:       ${CYAN}http://localhost:3000/api/docs${NC}"
echo -e "${CYAN}====================================================${NC}\n"

npx concurrently \
  --kill-others \
  --prefix "[{name}]" \
  --names "BACKEND,FRONTEND" \
  --prefix-colors "blue.bold,magenta.bold" \
  "npm run dev:backend" \
  "npm run dev:frontend"
