# AGENTS.md

## Escopo

Este diretório contém código reutilizável e independente de domínio: componentes compartilhados, primitives de UI, hooks genéricos e utils.

## Estrutura Atual

```txt
src/shared/
  components/
  hooks/
  ui/
  utils/
```

## `ui`

- Contém primitives visuais reutilizáveis.
- Exemplos: `Button`, `Input`, `Card`, `Badge`, `Toggle`.
- Deve ser genérico e não conhecer módulos.
- Deve aceitar props tipadas.
- Deve compor bem com `className`.
- Use `tailwind-variants` para variantes de estilo.
- Use `tailwind-merge` quando precisar resolver conflitos de classes.

## `components`

- Contém componentes compartilhados de nível mais alto.
- Exemplos: containers, headers, empty states, dialogs e bottom sheets.
- Não devem conter regra de negócio de um módulo específico.
- Devem receber conteúdo, labels e callbacks por props.

## `hooks`

- Contém hooks reutilizáveis entre módulos.
- Hooks compartilhados não devem depender de services ou repositories de módulos.
- Hooks devem encapsular comportamento, não regra de domínio.

## `utils`

- Contém funções puras ou wrappers pequenos.
- Exemplos: geração de ID, formatação de data.
- Devem ser pequenos, previsíveis e testáveis.
- Evite efeitos colaterais.
- Não importe React ou React Native sem necessidade.

## NativeWind E Tailwind

- Use `className` para estilos.
- Preserve o padrão visual existente.
- Não introduza estilos inline salvo quando a API exigir.
- Componentes compartilhados devem aceitar `className` quando composição visual for esperada.
- Rode `bun run format` após mudanças grandes de UI para ordenar classes.
- Preserve `src/styles/global.css`, `nativewind/babel` e `withNativeWind` configurados no projeto.

## Bottom Sheet

- Componentes com `@gorhom/bottom-sheet` devem considerar safe area.
- Preserve integração com Gesture Handler/Reanimated.
- Não remova `GestureHandlerRootView` do layout raiz.
- Evite recriar snap points/backdrops sem necessidade.

## Boas Práticas

- SOLID: cada componente deve ter uma responsabilidade clara.
- DRY: extraia para `shared` somente quando houver reutilização real.
- Clean Code: APIs de componentes devem ser simples e previsíveis.
- KISS: prefira props diretas a configurações complexas.
- YAGNI: não crie design system completo antes da necessidade.
- Composição: prefira `children` e props específicas a componentes rígidos.
- Acessibilidade: preserve labels, estados disabled/loading e feedback visual.
- Imutabilidade: não mute props ou objetos recebidos.

## Restrições

- `shared` não deve importar de `src/modules`.
- `shared` não deve importar de `src/app`.
- `shared` não deve acessar banco de dados.
- `shared` não deve conter nomes como `Work`, `Order` ou outros domínios específicos.
- Se um componente começar a depender de regra de negócio, mova-o para o módulo.

## Exemplos De Implementação

### UI Primitive Com `tailwind-variants`

```tsx
const badge = tv({
  base: 'rounded-full px-2 py-1',
  variants: {
    variant: {
      neutral: 'bg-slate-100 text-slate-700',
      success: 'bg-emerald-100 text-emerald-700',
      danger: 'bg-red-100 text-red-700',
    },
  },
  defaultVariants: {
    variant: 'neutral',
  },
});

type BadgeProps = VariantProps<typeof badge> & {
  children: React.ReactNode;
};

export const Badge: React.FC<BadgeProps> = ({ variant, children }) => {
  return <Text className={badge({ variant })}>{children}</Text>;
};
```

Use `tailwind-variants` quando um componente tiver variantes visuais previsíveis.

### Componente Compartilhado Genérico

```tsx
type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <View className="items-center justify-center gap-3 p-6">
      <Text className="text-lg font-semibold text-slate-900">{title}</Text>
      {description && (
        <Text className="text-center text-slate-500">{description}</Text>
      )}
      {actionLabel && onAction && (
        <Button onPress={onAction}>{actionLabel}</Button>
      )}
    </View>
  );
};
```

Não inclua termos de domínio como `Work`, `Order` ou `Customer` em componentes compartilhados.

### Hook Compartilhado

```ts
export const useBottomSheet = () => {
  const bottomSheetRef = useRef<BottomSheetMethods | null>(null);

  const open = () => bottomSheetRef.current?.expand();
  const close = () => bottomSheetRef.current?.close();

  return {
    bottomSheetRef,
    open,
    close,
  };
};
```

Hooks compartilhados encapsulam comportamento genérico, não regra de domínio.

### Utility Pura

```ts
export const formatDateTime = (date: string | Date): string => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};
```

Utils devem ser pequenas, previsíveis e sem dependência de UI.

### Geração De ID

```ts
import { v4 as uuidv4 } from 'uuid';

export const generateId = (): string => {
  return uuidv4();
};
```

Preserve o import de `react-native-get-random-values` no layout raiz, pois UUID depende disso no React Native.

### Composição Com `className`

```tsx
type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <View className={`rounded-2xl bg-white p-4 shadow-sm ${className ?? ''}`}>
      {children}
    </View>
  );
};
```

Componentes compartilhados devem permitir composição visual quando fizer sentido.

## Referências

- NativeWind: estilos com `className`, `global.css`, Babel preset e `withNativeWind` no Metro.
- Tailwind: composição por utility classes e conteúdo escaneado via `tailwind.config.js`.
- React Native: components compartilhados devem respeitar APIs nativas, estados disabled/loading e safe area quando aplicável.
