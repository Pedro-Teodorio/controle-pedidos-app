// contracts.ts — LMX-32: Fase 2 - Serviços / Works
// Read-only task artifact. Implementation must preserve these public shapes.

// Domain types

export type WorkStatus = 'active' | 'inactive';

export interface WorkContract {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly price: number;
  readonly status: WorkStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// Input/filter types

export interface CreateWorkContractInput {
  readonly name: string;
  readonly description?: string | null;
  readonly price: number;
  readonly status?: WorkStatus;
}

export type UpdateWorkContractInput = Partial<
  Omit<WorkContract, 'id' | 'createdAt' | 'updatedAt'>
>;

export interface FindAllWorksContractFilters {
  readonly search?: string;
  readonly status?: WorkStatus;
}

export interface EditWorkRouteParamsContract {
  readonly id?: string | readonly string[];
}

// Service interface

export interface WorksServiceContract {
  createWork(data: CreateWorkContractInput): Promise<void>;
  findAllWorks(
    filters: FindAllWorksContractFilters
  ): Promise<readonly WorkContract[]>;
  findWorkById(id: string): Promise<WorkContract>;
  updateWork(id: string, input: UpdateWorkContractInput): Promise<void>;
  deleteWork(id: string): Promise<void>;
}

// UI/mutation contracts

export interface EditWorkMutationContractInput {
  readonly id: string;
  readonly data: UpdateWorkContractInput;
}

export interface DeleteWorkMutationContractInput {
  readonly id: string;
}

export interface QueryInvalidationContract {
  readonly queryKey: readonly ['works'];
}

export type WorkOperationError =
  | { readonly code: 'INVALID_INPUT'; readonly message: string }
  | { readonly code: 'INVALID_ID'; readonly message: string }
  | { readonly code: 'NOT_FOUND'; readonly message: string }
  | { readonly code: 'PERSISTENCE_ERROR'; readonly message: string };

// Requirement traceability
// LMX32-01 → CreateWorkContractInput, WorkContract, WorksServiceContract.createWork
// LMX32-02 → WorkOperationError.INVALID_INPUT
// LMX32-03 → FindAllWorksContractFilters.status
// LMX32-04 → FindAllWorksContractFilters.search
// LMX32-05 → WorkStatus
// LMX32-06 → UpdateWorkContractInput, WorksServiceContract.updateWork
// LMX32-07 → UpdateWorkContractInput.status
// LMX32-08 → WorksServiceContract.deleteWork, DeleteWorkMutationContractInput
// LMX32-09 → QueryInvalidationContract, mutation input contracts
// LMX32-10 → EditWorkRouteParamsContract
// LMX32-11 → WorksServiceContract as boundary before repository persistence
