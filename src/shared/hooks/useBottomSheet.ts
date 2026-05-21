import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useCallback, useRef } from 'react';

export const useBottomSheet = () => {
  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  return {
    bottomSheetRef,
    handleOpenBottomSheet,
    handleCloseBottomSheet,
  };
};
