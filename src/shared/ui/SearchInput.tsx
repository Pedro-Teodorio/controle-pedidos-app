import { TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from './Icon';
import { ComponentProps } from 'react';

type SearchInputProps = ComponentProps<typeof TextInput> & {
  onClear: () => void;
};

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Buscar ...',
  onClear,
  ...props
}) => {
  return (
    <View className="flex h-14 flex-row items-center justify-center rounded-xl border border-slate-200 bg-white px-4 ">
      <Icon name="Search" className=" size-6 text-slate-400 " />
      <TextInput
        className="h-full flex-1 px-4 outline-none placeholder:text-slate-400"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        {...props}
      />
      {value && (
        <TouchableOpacity onPress={onClear}>
          <Icon name="X" className="size-6 text-slate-400" />
        </TouchableOpacity>
      )}
    </View>
  );
};
