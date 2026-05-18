import { Text } from 'react-native';
import { tv, VariantProps } from 'tailwind-variants';

const moneyText = tv({
  base: 'font-bold text-blue-600',
  variants: {
    size: {
      sm: 'text-base',
      md: 'text-lg',
      lg: 'text-xl',
      xl: 'text-2xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

type MoneyProps = VariantProps<typeof moneyText> & {
  amount: number;
};

export const MoneyText: React.FC<MoneyProps> = ({ amount, size }) => {
  return <Text className={moneyText({ size })}>R$ {amount.toFixed(2)}</Text>;
};
