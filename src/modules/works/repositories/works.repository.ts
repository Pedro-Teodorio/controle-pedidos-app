import { db } from '@/database/client';
import { works } from '@/database/schemas/works.schema';
import {
  CountByStatus,
  CreateWorkData,
  FindAllWorksFilters,
  Work,
  UpdateWorkData,
} from '../types/works.types';
import { and, asc, count, eq, like } from 'drizzle-orm';

const createWork = async (data: CreateWorkData): Promise<void> => {
  try {
    await db.insert(works).values(data);
  } catch (error) {
    console.error('[Works Repository] Erro ao criar work:', error);
    throw error;
  }
};

const findAllWorks = async (filters: FindAllWorksFilters): Promise<Work[]> => {
  try {
    const conditions = [];

    if (filters.search?.trim()) {
      conditions.push(like(works.name, `%${filters.search.trim()}%`));
    }
    if (filters.status !== undefined) {
      conditions.push(eq(works.status, filters.status));
    }

    const query = db
      .select()
      .from(works)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(works.name));

    return await query;
  } catch (error) {
    console.error('[Works Repository] Erro ao buscar works:', error);
    throw error;
  }
};

const findWorkById = async (id: string): Promise<Work | null> => {
  try {
    const result = await db
      .select()
      .from(works)
      .where(eq(works.id, id))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error(`[Works Repository] Erro ao buscar work ${id}:`, error);
    throw error;
  }
};

const updateWork = async (id: string, data: UpdateWorkData): Promise<void> => {
  try {
    await db.update(works).set(data).where(eq(works.id, id));
  } catch (error) {
    console.error(`[Works Repository] Erro ao atualizar work ${id}:`, error);
    throw error;
  }
};

const inactivateWork = async (id: string, updatedAt: string): Promise<void> => {
  try {
    await db
      .update(works)
      .set({ status: 'inactive', updatedAt })
      .where(eq(works.id, id));
  } catch (error) {
    console.error(`[Works Repository] Erro ao inativar work ${id}:`, error);
    throw error;
  }
};

const countWorksByStatusSummary = async (): Promise<CountByStatus> => {
  try {
    const [activeResult, inactiveResult] = await Promise.all([
      db
        .select({ count: count() })
        .from(works)
        .where(eq(works.status, 'active')),
      db
        .select({ count: count() })
        .from(works)
        .where(eq(works.status, 'inactive')),
    ]);

    return {
      active: activeResult[0]?.count ?? 0,
      inactive: inactiveResult[0]?.count ?? 0,
    };
  } catch (error) {
    console.error('[Works Repository] Erro ao contar works:', error);
    throw error;
  }
};

export const worksRepository = {
  createWork,
  findAllWorks,
  findWorkById,
  updateWork,
  inactivateWork,
  countWorksByStatusSummary,
};
