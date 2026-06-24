import { Text, TouchableOpacity, ScrollView, View } from 'react-native';
import { tv, VariantProps } from 'tailwind-variants';

const filterChips = tv({
  slots: {
    chip: 'rounded-full px-3.5 py-1.5 ',
    label: 'text-sm font-bold',
    count: 'text-sm font-bold opacity-70',
  },
  variants: {
    selected: {
      true: {
        chip: 'bg-blue-600',
        label: 'text-white',
        count: 'text-white',
      },
      false: {
        chip: 'bg-white border border-slate-200',
        label: 'text-slate-600',
        count: 'text-slate-600',
      },
    },
  },
});

type FilterChipValue = string;

type FilterChipOption<TValue extends FilterChipValue = FilterChipValue> = {
  value: TValue;
  label: string;
  count?: number;
};

export type FilterChipsProps<TValue extends FilterChipValue = FilterChipValue> =
  {
    options: readonly FilterChipOption<TValue>[];
    value: TValue;
    onChange: (value: TValue) => void;
    className?: string;
  };

type ChipProps = VariantProps<typeof filterChips> & {
  onPress?: () => void;
  option: FilterChipOption;
};

const Chip: React.FC<ChipProps> = ({ selected, option, onPress }) => {
  const { chip, label, count } = filterChips({ selected });

  return (
    <TouchableOpacity className={chip()} onPress={onPress} activeOpacity={0.75}>
      <View className="flex-row items-center gap-2">
        <Text className={label()}>{option.label}</Text>
        {option.count !== undefined && (
          <Text className={count()}>{option.count}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const FilterChips = <TValue extends FilterChipValue>({
  options,
  value,
  onChange,
  className,
}: FilterChipsProps<TValue>) => {
  return (
    <ScrollView
      className={`flex-1 ${className ?? ''}`}
      contentContainerClassName="gap-2"
      horizontal
      showsHorizontalScrollIndicator={false}>
      {options.map((option) => (
        <Chip
          key={option.value}
          selected={value === option.value}
          option={option}
          onPress={() => onChange(option.value)}
        />
      ))}
    </ScrollView>
  );
};
