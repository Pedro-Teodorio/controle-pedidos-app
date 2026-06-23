# AGENTS.md

## Escopo

Este diretório contém as rotas do Expo Router, layouts e bootstrap de navegação do app.

## Responsabilidades

- Declarar rotas com base em arquivos.
- Configurar layouts com `Stack` e `Tabs`.
- Inicializar providers globais no layout raiz.
- Aplicar migrações antes de renderizar as rotas.
- Exportar screens vindas de `src/modules`.

## Regras

- Mantenha arquivos de rota pequenos.
- Não coloque regra de negócio em arquivos de rota.
- Rotas e screens em `src/app` não devem acessar banco de dados diretamente.
- Não implemente formulários complexos diretamente nas rotas.
- Rotas devem importar screens dos módulos.
- Preserve `src/app/_layout.tsx` como ponto de bootstrap.
- Preserve o import de `react-native-get-random-values`.
- Preserve o import de `../styles/global.css`.
- Preserve `QueryClientProvider`.
- Preserve `GestureHandlerRootView`.
- Exceção: `src/app/_layout.tsx` pode importar `db` apenas para executar `useMigrations(db, migrations)` antes de renderizar as rotas.
- Preserve `useMigrations` antes de renderizar as rotas.

## Expo Router

- Use `_layout.tsx` para layouts compartilhados.
- Use grupos como `(tabs)` quando a organização não deve afetar a URL.
- Use `[id].tsx` para rotas dinâmicas.
- Configure `headerShown` nos layouts, não repetidamente em cada screen quando possível.
- Evite navegação manual complexa quando a estrutura de arquivos resolver o caso.
- Preserve typed routes e aliases configurados no projeto.

## Boas Práticas

- Separação de responsabilidades: rota roteia, módulo implementa.
- Clean Code: nomes de arquivos devem refletir a URL ou o papel do layout.
- DRY: configurações repetidas devem ir para layouts.
- KISS: não crie wrappers de navegação sem necessidade.
- YAGNI: não adicione providers globais antes de haver uso real.
- SOLID: mantenha `src/app` dependente de screens públicas dos módulos, não de detalhes internos.

## Exemplos De Implementação

### Rota Simples

```ts
import { WorkListScreen } from '@/modules/works/screens/WorkListScreen';

export default WorkListScreen;
```

Use quando o arquivo representa uma tela completa do módulo.

### Rota Dinâmica

```ts
import { EditWorkScreen } from '@/modules/works/screens/EditWorkScreen';

export default EditWorkScreen;
```

Arquivo esperado:

```txt
src/app/works/[id].tsx
```

A leitura do parâmetro deve ficar na screen do módulo, não no arquivo de rota, salvo se houver motivo claro.

### Layout De Grupo

```tsx
import { Tabs } from 'expo-router';

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
    </Tabs>
  );
};

export default TabsLayout;
```

Baseado no padrão do Expo Router para layouts e route groups.

### Layout Raiz Com Bootstrap

```tsx
const queryClient = new QueryClient();

const RootLayout = () => {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return <Text>Erro ao preparar banco de dados</Text>;
  }

  if (!success) {
    return <Text>Preparando banco de dados...</Text>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="works" options={{ headerShown: false }} />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};
```

Use o layout raiz para providers globais e migração antes da renderização das rotas.

## Referências

- Expo Router: file-based routing, `_layout.tsx`, route groups, dynamic routes e typed routes.
- Drizzle Expo SQLite: `useMigrations` deve bloquear a renderização do app até a migração finalizar.
