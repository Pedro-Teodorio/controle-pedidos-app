import { ComponentProps } from 'react';
import { Text, TextInput, View } from 'react-native';
import { tv, VariantProps } from 'tailwind-variants';

const input = tv({
  base: 'rounded-xl border border-slate-200 h-12 bg-white  text-base placeholder:text-slate-400 focus:border-blue-500 px-4',
  variants: {
    isDisabled: {
      true: 'opacity-50 bg-slate-50',
      false: '',
    },
    hasError: {
      true: 'border-red-500 focus:border-red-500',
      false: '',
    },
  },
  defaultVariants: {
    hasError: false,
    isDisabled: false,
  },
});

type InputProps = ComponentProps<typeof TextInput> &
  VariantProps<typeof input> & {
    label?: string;
    errorMessage?: string;
  };

export const Input: React.FC<InputProps> = ({
  hasError,
  isDisabled,
  errorMessage,
  label,
  editable,
  ...rest
}) => {
  const isFieldDisabled = isDisabled || editable === false;
  const resolvedEditable = isDisabled ? false : editable;

  return (
    <View className="flex-1 gap-2">
      {label && (
        <Text className="block text-base font-semibold text-slate-700">
          {label}
        </Text>
      )}
      <TextInput
        editable={resolvedEditable}
        className={input({ hasError, isDisabled: isFieldDisabled })}
        {...rest}
      />
      {hasError && errorMessage ? (
        <Text className="text-sm font-medium text-red-600">{errorMessage}</Text>
      ) : null}
    </View>
  );
};
