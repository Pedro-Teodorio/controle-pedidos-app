import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { z } from 'zod';

const nameSchema = z.object({
  name: z.string().nonempty('Nao pode ser vazio'),
});
type NameSchema = z.infer<typeof nameSchema>;

const AjustesScreen = () => {
  const [name, setName] = useState('');
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NameSchema>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (data: NameSchema) => {
    setName(data.name);
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Ajustes" subtitle="Configurações do app" />
      <View className="gap-4">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value, onBlur, disabled } }) => (
            <Input
              label="Nome"
              placeholder="Digite seu nome"
              onChangeText={onChange}
              value={value}
              onBlur={onBlur}
              editable={disabled}
              errorMessage={errors.name?.message}
              hasError={!!errors.name}
            />
          )}
        />
        <Button onPress={handleSubmit(onSubmit)}>Submit</Button>
        <Text>{name}</Text>
      </View>
    </ScreenContainer>
  );
};

export default AjustesScreen;
