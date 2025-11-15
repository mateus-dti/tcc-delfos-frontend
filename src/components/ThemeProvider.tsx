export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // O tema já é inicializado no main.tsx antes do React renderizar
  // Este componente apenas garante que o contexto do tema está disponível
  return <>{children}</>
}

