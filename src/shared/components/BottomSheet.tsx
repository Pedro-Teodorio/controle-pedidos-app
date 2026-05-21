import React, { useCallback, useMemo } from 'react';

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BottomSheetComponentProps = {
  bottomSheetRef: React.RefObject<BottomSheetMethods | null>;
  maxHeight: string;
  children: React.ReactNode;
};

export const BottomSheetComponent: React.FC<BottomSheetComponentProps> = ({
  bottomSheetRef,
  maxHeight,
  children,
}) => {
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => [`${maxHeight}%`], [maxHeight]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.3}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      bottomInset={insets.bottom}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enableContentPanningGesture={false}
      enablePanDownToClose>
      <BottomSheetView className="flex-1 bg-white p-4">
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
};
