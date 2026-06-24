import { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenContainerProps = {
  children: ReactNode;
  className?: string;
  contentContainerClassName?: string;
};

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  className,
  contentContainerClassName,
}) => {
  return (
    <SafeAreaView
      className={`flex-1 bg-slate-50 ${className ?? ''}`}
      edges={['top', 'bottom']}>
      <ScrollView
        className="flex-1 gap-4"
        contentContainerClassName={`flex-grow p-4 ${contentContainerClassName ?? ''}`}
        keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};
