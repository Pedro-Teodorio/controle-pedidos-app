/*
 * Contratos técnicos - LMX-30
 *
 * Este arquivo é uma referência para a execução futura.
 * Não contém implementação, acesso a banco, UI ou regra de negócio executável.
 */

export type WorkStatus = 'active' | 'inactive';

export type WorkId = string;

export type WorkEntity = {
  id: WorkId;
  name: string;
  description: string | null;
  price: number;
  status: WorkStatus;
  createdAt: string;
  updatedAt: string;
};

export type WorkStatusFilter = WorkStatus;

export type FindAllWorksFiltersContract = {
  search?: string;
  status?: WorkStatusFilter;
};

export type CountByStatusContract = Record<WorkStatus, number>;

export type UpdateWorkInputContract = Partial<
  Omit<WorkEntity, 'id' | 'createdAt' | 'updatedAt'>
>;

export type UpdateWorkDataContract = Partial<
  Omit<WorkEntity, 'id' | 'createdAt'>
> & {
  updatedAt: string;
};

export type DeleteWorkInputContract = {
  id: WorkId;
};

export type EditWorkRouteParamsContract = {
  id?: string | string[];
};

export type WorkCatalogDefaultFilterContract = {
  status: 'active';
  search?: string;
};

export type InactiveWorkCatalogFilterContract = {
  status: 'inactive';
  search?: string;
};

export type WorkFormStatusCopyContract = {
  title: 'Status ativo';
  description: 'Disponível para novas notas';
};

export type DeleteWorkConfirmationCopyContract = {
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  destructive: true;
};

export type DeleteWorkConfirmationRequirementsContract = {
  mustRequireConfirmation: true;
  mustCommunicatePermanentDeletion: true;
  mustCommunicateCatalogRemoval: true;
  mustCommunicateIrreversibleAction: true;
  mustNotDescribeDeletionAsInactivation: true;
};

export type WorkCatalogMutationInvalidationContract = {
  invalidatesQueryKey: readonly ['works'] | readonly unknown[];
};

export interface WorksRepositoryContract {
  findAllWorks(filters: FindAllWorksFiltersContract): Promise<WorkEntity[]>;
  findWorkById(id: WorkId): Promise<WorkEntity | null>;
  updateWork(id: WorkId, data: UpdateWorkDataContract): Promise<void>;
  /** Deve remover fisicamente o registro de works, sem soft delete. */
  deleteWork(id: WorkId): Promise<void>;
  countWorksByStatusSummary(): Promise<CountByStatusContract>;
}

export interface WorksServiceContract {
  findAllWorks(filters: FindAllWorksFiltersContract): Promise<WorkEntity[]>;
  findWorkById(id: WorkId): Promise<WorkEntity>;
  updateWork(id: WorkId, input: UpdateWorkInputContract): Promise<void>;
  /** Deve validar ID e existência antes de delegar a exclusão física. */
  deleteWork(id: WorkId): Promise<void>;
  getStatusSummary(): Promise<CountByStatusContract>;
}

export type ValidateWorkIdContract = (id: WorkId) => void;

export type ValidateUpdateWorkInputContract = (
  input: UpdateWorkInputContract
) => void;

export type WorksQueryKeysContract = {
  all: readonly ['works'];
  findAllWithFilters: (
    filters: FindAllWorksFiltersContract
  ) => readonly unknown[];
  findById: (id: WorkId) => readonly unknown[];
  countByStatus: () => readonly unknown[];
};

export type WorksQueryOptionsContract = {
  findAll(filters?: FindAllWorksFiltersContract): unknown;
  findById(id: WorkId): unknown;
  countByStatus(): unknown;
};

export type UseWorksContract = (
  filters?: FindAllWorksFiltersContract
) => unknown;

export type UseWorkContract = (id: WorkId) => unknown;

export type EditWorkMutationVariablesContract = {
  id: WorkId;
  data: UpdateWorkInputContract;
};

export type DeleteWorkMutationVariablesContract = {
  id: WorkId;
};

export type UseEditWorkMutationContract = () => unknown;

export type UseDeleteWorkMutationContract = () => unknown;

export type WorkFormPropsContract = {
  defaultValues?: Partial<UpdateWorkInputContract>;
  isSubmitting?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
  onSubmit: (data: UpdateWorkInputContract) => Promise<void> | void;
  onDelete?: () => void;
};

export type EditWorkScreenContract = {
  resolveRouteWorkId(params: EditWorkRouteParamsContract): WorkId | undefined;
  submitUpdate(data: UpdateWorkInputContract): Promise<void>;
  requestDeleteConfirmation(): void;
  confirmPhysicalDeletion(): Promise<void>;
};

export type FutureOrderServiceSelectionFiltersContract = {
  /** Contrato futuro: novas notas devem buscar somente serviços ativos. */
  status: 'active';
  search?: string;
};

export type FutureOrderItemServiceSnapshotContract = {
  /** Contrato futuro: histórico não deve depender da existência futura do registro em works. */
  workId: WorkId | null;
  workNameSnapshot: string;
  workUnitPriceSnapshot: number;
};

export type OutOfScopeContracts = {
  createOrdersModule: false;
  createOrderSchemas: false;
  createOrderMigrations: false;
  implementSoftDelete: false;
  replacePhysicalDeleteWithInactivation: false;
};
