import {
  WorkFormInput,
  WorkFormData,
  workFormSchema,
} from '../schemas/work.form.schema';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text, View } from 'react-native';
import { Input } from '@/shared/ui/Input';
import { Card } from '@/shared/ui/Card';
import { TextArea } from '@/shared/ui/TextArea';
import { Toggle } from '@/shared/ui/Toggle';
import { Button } from '@/shared/ui/Button';

type WorkFormProps = {
  defaultValues?: Partial<WorkFormInput>;
  isSubmitting?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
  onSubmit: (data: WorkFormData) => Promise<void> | void;
  onDelete?: () => void;
};

export const WorkForm: React.FC<WorkFormProps> = ({
  defaultValues,
  isSubmitting = false,
  submitLabel = 'Salvar',
  onCancel,
  onSubmit,
  onDelete,
}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<WorkFormInput, unknown, WorkFormData>({
    resolver: zodResolver(workFormSchema),
    values: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? null,
      price: defaultValues?.price ?? '',
      status: defaultValues?.status ?? 'active',
    },
  });

  return (
    <View className="flex-1 justify-between gap-4">
      <View className="gap-4">
        <Card>
          <View className="gap-4">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nome *"
                  placeholder="Ex: Coroa em zircônia"
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                  editable={!isSubmitting}
                  hasError={!!errors.name}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextArea
                  label="Descrição"
                  placeholder="Detalhes do serviço (opcional)"
                  onChangeText={onChange}
                  value={value ?? ''}
                  onBlur={onBlur}
                  editable={!isSubmitting}
                  hasError={!!errors.description}
                  errorMessage={errors.description?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Preço *"
                  placeholder="Ex: R$ 100,00"
                  onChangeText={onChange}
                  value={value?.toString()}
                  onBlur={onBlur}
                  editable={!isSubmitting}
                  hasError={!!errors.price}
                  errorMessage={errors.price?.message}
                  keyboardType="decimal-pad"
                />
              )}
            />
          </View>
        </Card>
        <Card>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-semibold text-slate-900">Status ativo</Text>
              <Text className="text-sm text-slate-500">
                Disponível para novas notas
              </Text>
            </View>
            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <Toggle
                  disabled={isSubmitting}
                  onValueChange={(e) => onChange(e ? 'active' : 'inactive')}
                  value={value === 'active'}
                />
              )}
            />
          </View>
        </Card>
        {defaultValues?.name && (
          <Button
            variant="danger_ghost"
            size="lg"
            disabled={isSubmitting}
            onPress={() => onDelete?.()}>
            Excluir Serviço
          </Button>
        )}
      </View>
      <View className="flex-row items-center gap-2 ">
        {onCancel && (
          <Button
            variant="secondary"
            size="lg"
            disabled={isSubmitting}
            onPress={onCancel}
            className="flex-1">
            Cancelar
          </Button>
        )}
        <Button
          size="lg"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
          className="flex-1">
          {submitLabel}
        </Button>
      </View>
    </View>
  );
};
