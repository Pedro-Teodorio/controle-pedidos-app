export type Work = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};

// Input - o que vem do cliente
export type CreateWorkInput = Omit<Work, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateWorkInput = Partial<
  Omit<Work, 'id' | 'createdAt' | 'updatedAt'>
>;

// Data - o que vai para o banco
export type CreateWorkData = Work;
export type UpdateWorkData = Partial<Omit<Work, 'id' | 'createdAt'>> & {
  updatedAt: string;
};

export type FindAllWorksFilters = {
  search?: string;
  status?: StatusFilter;
};

export type StatusFilter = 'active' | 'inactive';
export type CountByStatus = Record<StatusFilter, number>;

export type StatusOptions = {
  label: string;
  value: StatusFilter;
  count: number;
};
