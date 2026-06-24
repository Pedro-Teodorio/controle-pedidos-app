import { ReactElement } from 'react';
import { FlatList, FlatListProps, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ListScreenContainerProps<T> = Omit<
  FlatListProps<T>,
  'renderItem' | 'data'
> & {
  data: readonly T[];
  renderItem: ListRenderItem<T>;
  header?: ReactElement | null;
  empty?: ReactElement | null;
  footer?: ReactElement | null;
  className?: string;
  contentContainerClassName?: string;
};

export function ListScreenContainer<T>({
  data,
  renderItem,
  header,
  empty,
  footer,
  className,
  contentContainerClassName,
  ...props
}: ListScreenContainerProps<T>) {
  return (
    <SafeAreaView
      className={`flex-1 bg-slate-50 ${className ?? ''}`}
      edges={['top']}>
      <FlatList
        data={data}
        renderItem={renderItem}
        className="flex-1"
        contentContainerClassName={`gap-4 p-4 ${contentContainerClassName ?? ''}`}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        ListFooterComponent={footer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...props}
      />
    </SafeAreaView>
  );
}
