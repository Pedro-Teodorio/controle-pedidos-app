import { StatusFilter } from '@/modules/works/types/works.types';
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

export type FilterChipsProps = {
  options: {
    value: StatusFilter;
    label: string;
    count?: number;
  }[];
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
};

type ChipProps = VariantProps<typeof filterChips> & {
  onPress?: () => void;
  option: {
    value: string;
    label: string;
    count?: number;
  };
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

export const FilterChips: React.FC<FilterChipsProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <ScrollView
      className="flex-1"
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
