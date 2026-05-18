import { ComponentProps } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { tv, VariantProps } from 'tailwind-variants';

const card = tv({
  base: 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm',
  variants: {
    selected: {
      true: 'border-blue-600',
    },
    disabled: {
      true: 'opacity-50',
    },
  },
  defaultVariants: {
    selected: false,
    disabled: false,
  },
});

type CardProps = VariantProps<typeof card> &
  ComponentProps<typeof TouchableWithoutFeedback>;

export const Card: React.FC<CardProps> = ({
  children,
  selected,
  disabled,
  onPress,
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View className={card({ selected, disabled })}>{children}</View>
    </TouchableWithoutFeedback>
  );
};
