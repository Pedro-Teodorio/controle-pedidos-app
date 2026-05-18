import {
  WorkFormInput,
  WorkFormData,
  workFormSchema,
} from '../schemas/work.form.schema';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text, View, Switch } from 'react-native';
import { Input } from '@/shared/ui/Input';
import { Card } from '@/shared/ui/Card';
import { TextArea } from '@/shared/ui/TextArea';

type WorkFormProps = {
  defaultValues?: Partial<WorkFormInput>;
  isSubmitting?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
  onSubmit: (data: WorkFormData) => Promise<void> | void;
};

export const WorkForm: React.FC<WorkFormProps> = ({
  defaultValues,
  isSubmitting = false,
  submitLabel = 'Salvar',
  onCancel,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkFormInput, unknown, WorkFormData>({
    resolver: zodResolver(workFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
      price: defaultValues?.price ?? '',
      status: defaultValues?.status ?? 'active',
    },
  });

  return (
    <View className="gap-4 pt-4">
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
          <Switch />
        </View>
      </Card>
    </View>
  );
};
