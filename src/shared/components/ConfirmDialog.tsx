import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

import { Text, View } from 'react-native';
import { Button } from '../ui/Button';
import { BottomSheetComponent } from './BottomSheet';

type ConfirmDialogProps = {
  bottomSheetRef: React.RefObject<BottomSheetMethods | null>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  isSubmitting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  bottomSheetRef,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  destructive = false,
  isSubmitting = false,
}) => {
  return (
    <BottomSheetComponent bottomSheetRef={bottomSheetRef} maxHeight="27">
      <View className="gap-4 px-4">
        <Text className="text-xl font-bold text-slate-900">{title}</Text>
        <Text className="text-lg text-slate-500">{description}</Text>
        <View className="flex-row items-center gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            onPress={onCancel}>
            {cancelText}
          </Button>
          <Button
            variant={destructive ? 'destructive' : 'primary'}
            size="lg"
            className="flex-1"
            onPress={onConfirm}
            isLoading={isSubmitting}>
            {confirmText}
          </Button>
        </View>
      </View>
    </BottomSheetComponent>
  );
};
