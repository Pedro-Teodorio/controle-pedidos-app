import { TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from './Icon';
import { ComponentProps } from 'react';

type SearchInputProps = ComponentProps<typeof TextInput> & {
  onClear: () => void;
  className?: string;
};

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Buscar ...',
  onClear,
  className,
  ...props
}) => {
  return (
    <View
      className={`flex h-14 flex-row items-center justify-center rounded-xl border border-slate-200 bg-white px-4 ${className ?? ''}`}>
      <Icon name="Search" className=" size-6 text-slate-400 " />
      <TextInput
        className="h-full flex-1 px-4 outline-none placeholder:text-slate-400"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        {...props}
      />
      {value && (
        <TouchableOpacity
          onPress={onClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca">
          <Icon name="X" className="size-6 text-slate-400" />
        </TouchableOpacity>
      )}
    </View>
  );
};
