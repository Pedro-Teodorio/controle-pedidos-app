import { generateId } from '@/shared/utils/id';
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

const findWorkById = async (id: string): Promise<Work> => {
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

  const work = await findWorkById(id);

  if (!work) {
    throw new Error(`Work ID ${id} não encontrado`);
  }

  const updateData = {
    ...input,
    updatedAt: new Date().toISOString(),
  };

  await worksRepository.updateWork(id, updateData);
};

const deleteWork = async (id: string): Promise<void> => {
  validateId(id);

  const work = await findWorkById(id);

  if (!work) {
    throw new Error(`Work ID ${id} não encontrado`);
  }

  await worksRepository.deleteWork(id);
};

const getStatusSummary = async () => {
  return await worksRepository.countWorksByStatusSummary();
};

export const worksService = {
  createWork,
  findAllWorks,
  findWorkById,
  updateWork,
  deleteWork,
  getStatusSummary,
};
