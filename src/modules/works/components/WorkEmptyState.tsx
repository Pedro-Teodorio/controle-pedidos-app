import { EmptyState } from '@/shared/components/EmptyState';
import { IconName } from '@/shared/ui/Icon';

type WorkEmptyStateProps = {
  variant: 'empty' | 'search';
  onAction?: () => void;
};

type EmptyStateVariant = {
  title: string;
  description: string;
  action?: string;
  iconName: IconName;
  onAction?: () => void;
};

export const WorkEmptyState: React.FC<WorkEmptyStateProps> = ({
  variant,
  onAction,
}) => {
  const isSearch = variant === 'search';
  const Icon = isSearch ? 'Search' : ('Inbox' as IconName);

  const emptyStateVariant: EmptyStateVariant = isSearch
    ? {
        title: 'Nenhum serviço encontrado',
        description:
          'Tente buscar por outro nome ou altere o filtro selecionado',
        iconName: Icon,
      }
    : {
        title: 'Sem serviços ainda',
        description: 'Crie um novo serviço para começar',
        action: 'Novo serviço',
        iconName: Icon,
        onAction: onAction,
      };

  return (
    <EmptyState
      title={emptyStateVariant.title}
      description={emptyStateVariant.description}
      action={emptyStateVariant.action}
      iconName={emptyStateVariant.iconName}
      onAction={emptyStateVariant.onAction}
    />
  );
};
