import { generateId } from '@/shared/ui/utils/id';
import { worksRepository } from '../repositories/works.repository';
import {
  CreateWorkInput,
  FindAllWorksFilters,
  UpdateWorkInput,
  Work,
} from '../types/works.types';

// Validadores (regras de negócio)
const validateCreateWork = (data: CreateWorkInput): void => {
  if (!data.name?.trim()) {
    throw new Error('Nome é obrigatório');
  }

  if (!Number.isFinite(data.price)) {
    throw new Error('Informe um preço válido.');
  }

  if (data.price < 0) {
    throw new Error('Preço não pode ser negativo');
  }
};

const validateUpdateWorkInput = (data: UpdateWorkInput): void => {
  if (data.name !== undefined && !data.name?.trim()) {
    throw new Error('Nome não pode estar vazio');
  }

  if (data.price !== undefined) {
    if (!Number.isFinite(data.price)) {
      throw new Error('Informe um preço válido.');
    }
    if (data.price < 0) {
      throw new Error('Preço não pode ser negativo');
    }
  }
};

const validateId = (id: string): void => {
  if (!id || typeof id !== 'string') {
    throw new Error('ID inválido');
  }
};

const createWork = async (data: CreateWorkInput): Promise<void> => {
  validateCreateWork(data);

  const workData = {
    id: generateId(),
    name: data.name.trim(),
    description: data.description?.trim() ?? null,
    price: data.price,
    status: data.status ?? 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await worksRepository.createWork(workData);
};

const findAllWorks = async (filters: FindAllWorksFilters): Promise<Work[]> => {
  return await worksRepository.findAllWorks(filters);
};

const findWorkById = async (id: string): Promise<Work | null> => {
  validateId(id);
  const work = await worksRepository.findWorkById(id);
  if (!work) {
    throw new Error(`Work ID ${id} não encontrado`);
  }
  return work;
};

const updateWork = async (
  id: string,
  input: UpdateWorkInput
): Promise<void> => {
  validateId(id);
  validateUpdateWorkInput(input);

  // Verifica se existe
  await findWorkById(id);

  const updateData = {
    ...input,
    updatedAt: new Date().toISOString(),
  };

  await worksRepository.updateWork(id, updateData);
};

const inactivateWork = async (id: string): Promise<void> => {
  validateId(id);
  await worksRepository.inactivateWork(id, new Date().toISOString());
};

const getStatusSummary = async () => {
  return await worksRepository.countWorksByStatusSummary();
};

export const worksService = {
  createWork,
  findAllWorks,
  findWorkById,
  updateWork,
  inactivateWork,
  getStatusSummary,
};
