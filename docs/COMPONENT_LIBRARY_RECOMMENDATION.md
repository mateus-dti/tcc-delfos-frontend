# Recomendação de Biblioteca de Componentes

## Análise dos Protótipos

Após análise dos protótipos em `prototypes/`, identifiquei que todos utilizam:
- **Tailwind CSS** como framework de estilização
- **Material Symbols Outlined** para ícones
- **Dark mode** via classe `dark` (darkMode: "class")
- Componentes customizados sem biblioteca de componentes pronta

## Opções Disponíveis

### 1. ✅ **RECOMENDADO: Tailwind CSS + Shadcn/ui**

**Vantagens:**
- ✅ Alinhado 100% com os protótipos (usa Tailwind CSS)
- ✅ Componentes acessíveis e bem testados
- ✅ Totalmente customizável (código no seu projeto)
- ✅ Dark mode nativo
- ✅ Componentes prontos: Button, Input, Card, Table, Dialog, Dropdown, etc.
- ✅ TypeScript nativo
- ✅ Fácil de manter e estender

**Desvantagens:**
- ⚠️ Requer migração do Ant Design atual
- ⚠️ Setup inicial um pouco mais trabalhoso

**Componentes disponíveis que você precisará:**
- Button, Input, Card, Table, Dialog, Dropdown, Tabs, Badge, Alert, etc.

**Instalação:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs
# ... outros componentes conforme necessário
```

---

### 2. **Tailwind CSS + Headless UI**

**Vantagens:**
- ✅ Alinhado com protótipos
- ✅ Componentes headless (sem estilos pré-definidos)
- ✅ Total controle sobre design

**Desvantagens:**
- ⚠️ Mais trabalho manual (precisa criar todos os estilos)
- ⚠️ Menos componentes prontos

---

### 3. **Continuar com Ant Design (atual)**

**Vantagens:**
- ✅ Já está instalado
- ✅ Muitos componentes prontos
- ✅ Documentação excelente

**Desvantagens:**
- ❌ Design muito diferente dos protótipos
- ❌ Customização complexa para ficar igual ao protótipo
- ❌ Não usa Tailwind CSS (diferente dos protótipos)
- ❌ Tema do Ant Design não corresponde ao design system dos protótipos

**Para usar Ant Design com os protótipos seria necessário:**
- Customizar profundamente o tema do Ant Design
- Sobrescrever muitos estilos CSS
- Criar componentes wrapper para cada componente do Ant Design
- Resultado: muito trabalho e código difícil de manter

---

## Componentes Necessários (baseado nos protótipos)

### Páginas Identificadas:
1. **Login** ✅ (já implementado com Ant Design)
2. **Dashboard de Coleções** - Cards, Grid, Search, Filters, Badges
3. **Detalhes da Coleção** - Tabs, Table, Breadcrumbs, Buttons
4. **Criar/Editar Coleção** - Form, Input, Select, Textarea
5. **Lista de Data Sources** - Table, Status badges
6. **Chat/Prompt** - Input, Chat bubbles, History
7. **Editor SQL** - Code editor com syntax highlighting
8. **Resultados** - Table paginada, Export buttons

### Componentes Necessários:
- ✅ Button (vários estilos: primary, secondary, danger)
- ✅ Input / TextField
- ✅ Card
- ✅ Table (com sorting, pagination)
- ✅ Badge / Status indicators
- ✅ Dropdown / Select
- ✅ Dialog / Modal
- ✅ Tabs
- ✅ Breadcrumbs
- ✅ Sidebar / Navigation
- ✅ Search bar
- ✅ Code editor (Monaco Editor ou similar)
- ✅ Alert / Error messages

---

## Recomendação Final

### **Migrar para Tailwind CSS + Shadcn/ui**

**Por quê?**
1. Os protótipos já estão em Tailwind CSS
2. Shadcn/ui oferece componentes prontos baseados em Tailwind
3. Você terá controle total sobre o código (componentes ficam no seu projeto)
4. Fácil customização para seguir exatamente os protótipos
5. Melhor experiência de desenvolvimento a longo prazo

### Plano de Migração Sugerido:

**Fase 1: Setup**
- Instalar Tailwind CSS
- Configurar Shadcn/ui
- Criar componentes base (Button, Input, Card)

**Fase 2: Migração Gradual**
- Migrar página de Login primeiro
- Depois Dashboard
- Depois outras páginas conforme desenvolvimento

**Fase 3: Remover Ant Design**
- Após migrar todas as páginas
- Remover dependência do Ant Design

---

## Próximos Passos

Se você concordar com a migração, posso:
1. Configurar Tailwind CSS no projeto
2. Instalar e configurar Shadcn/ui
3. Migrar a página de Login para usar Tailwind + Shadcn/ui
4. Criar componentes base reutilizáveis

**Ou** se preferir continuar com Ant Design:
- Posso criar um tema customizado do Ant Design tentando aproximar dos protótipos
- Mas será necessário muito trabalho de customização

---

## Referências

- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Radix UI Primitives](https://www.radix-ui.com/) (base do Shadcn/ui)

