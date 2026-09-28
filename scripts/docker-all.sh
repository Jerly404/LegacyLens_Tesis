#!/usr/bin/env bash

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}====================================================${NC}"
echo -e "${CYAN}  Levantando TODO el ecosistema en Docker...        ${NC}"
echo -e "${CYAN}====================================================${NC}"

docker compose up --build -d

echo -e "\n${GREEN}✓ Ecosistema completo levantado exitosamente en Docker:${NC}"
echo -e "  • Frontend Web:      ${CYAN}http://localhost:80${NC}"
echo -e "  • Backend NestJS:    ${CYAN}http://localhost:3000/api${NC}"
echo -e "  • Swagger API Docs:  ${CYAN}http://localhost:3000/api/docs${NC}"
echo -e "  • MinIO Storage:     ${CYAN}http://localhost:9001 (minioadmin / minioadmin)${NC}"
echo -e "  • Qdrant Vector DB:  ${CYAN}http://localhost:6333/dashboard${NC}"
echo -e "  • Ollama Local LLM:  ${CYAN}http://localhost:11434${NC}"
echo -e "${CYAN}====================================================${NC}\n"
