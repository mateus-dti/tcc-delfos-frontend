# Frontend - Delfos UI

Interface web desenvolvida em React + Vite + TypeScript para interação com o sistema Delfos.

## 🚀 Inicialização do Repositório

Este módulo possui seu próprio repositório Git. Para inicializar:

```bash
cd frontend
git init
git remote add origin <url-do-repositorio-frontend>
git add .
git commit -m "Initial commit: Frontend structure"
git branch -M main
git push -u origin main
```

## 📁 Estrutura

- **components/**: Componentes React reutilizáveis
- **pages/**: Páginas da aplicação
- **hooks/**: Custom hooks para lógica reutilizável
- **lib/**: Bibliotecas e configurações
- **types/**: Definições TypeScript
- **services/**: Serviços de comunicação com a API
- **utils/**: Funções utilitárias

## Páginas Principais

- Login / Perfil
- Dashboard de Coleções
- Página da Coleção (schema, relacionamentos, configuração)
- Chat / Prompt (perguntas em linguagem natural)
- Editor SQL (com highlighting)
- Resultados (tabela paginada, exportação)
- Histórico de consultas

## Tecnologias

- React 18+
- Vite
- TypeScript
- Ant Design (UI components)

