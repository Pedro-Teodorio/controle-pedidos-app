import { Text, View } from 'react-native';
import { tv, VariantProps } from 'tailwind-variants';

const statusLabels: Record<string, string> = {
  open: 'Aberta',
  closed: 'Finalizada',
  canceled: 'Cancelada',
  draft: 'Rascunho',
  active: 'Ativo',
  inactive: 'Inativo',
  info: 'Em revisão',
};

const badge = tv({
  slots: {
    base: 'inline-flex items-center rounded-full px-2.5 py-1 bg-slate-100 text-slate-700',
    text: 'text-sm font-bold uppercase tracking-wider',
  },
  variants: {
    status: {
      open: {
        base: 'bg-amber-100 ',
        text: 'text-amber-700',
      },
      closed: {
        base: 'bg-green-100 ',
        text: 'text-green-700',
      },
      canceled: {
        base: 'bg-red-100 ',
        text: 'text-red-700',
      },
      draft: {
        base: 'bg-slate-100 ',
        text: 'text-slate-600',
      },
      active: {
        base: 'bg-green-100 ',
        text: 'text-green-700',
      },
      inactive: {
        base: 'bg-slate-300 ',
        text: 'text-slate-600',
      },
      info: {
        base: 'bg-blue-100 ',
        text: 'text-blue-700',
      },
    },
  },
  defaultVariants: {
    status: 'info',
  },
});

export const Badge: React.FC<VariantProps<typeof badge>> = ({ status }) => {
  const { base, text } = badge({ status });
  const label = status ? statusLabels[status] : '';

  return (
    <View className={base()}>
      <Text className={text()}>{label}</Text>
    </View>
  );
};
