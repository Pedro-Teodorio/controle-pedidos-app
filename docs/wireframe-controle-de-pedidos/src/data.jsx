// Mock data + helpers for the interactive prototype
const fmtBRL = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

const initialServicos = [
  { id: 's1', nome: 'Aplicação de porcelana', descricao: 'Acabamento premium', preco: 90, status: 'ativo' },
  { id: 's2', nome: 'Copping', descricao: 'Serviço de acabamento', preco: 70, status: 'ativo' },
  { id: 's3', nome: 'Ajuste fino', descricao: 'Correção e ajuste', preco: 50, status: 'ativo' },
  { id: 's4', nome: 'Manutenção completa', descricao: 'Revisão geral', preco: 180, status: 'ativo' },
  { id: 's5', nome: 'Polimento', descricao: 'Acabamento superficial', preco: 40, status: 'ativo' },
  { id: 's6', nome: 'Limpeza profunda', descricao: 'Higienização total', preco: 65, status: 'ativo' },
  { id: 's7', nome: 'Reforma antiga', descricao: '', preco: 250, status: 'inativo' },
];

const initialClientes = [
  { id: 'c1', nome: 'João da Silva', telefone: '(11) 99999-0001' },
  { id: 'c2', nome: 'Maria Ana Souza', telefone: '(11) 98888-0002' },
  { id: 'c3', nome: 'Carlos Lima', telefone: '(11) 97777-0003' },
  { id: 'c4', nome: 'Patrícia Mendes', telefone: '(11) 96666-0004' },
  { id: 'c5', nome: 'Ricardo Alves', telefone: '(11) 95555-0005' },
];

const initialNotas = [
  {
    id: 'n1', numero: '0012', clienteId: 'c1', clienteNome: 'João da Silva', clienteTelefone: '(11) 99999-0001',
    observacao: 'Cliente preferencial',
    itens: [
      { id: 'i1', servicoId: 's2', nome: 'Copping', quantidade: 2, precoUnitario: 70, subtotal: 140 },
      { id: 'i2', servicoId: 's3', nome: 'Ajuste fino', quantidade: 1, precoUnitario: 50, subtotal: 50 },
      { id: 'i3', servicoId: 's1', nome: 'Aplicação de porcelana', quantidade: 2, precoUnitario: 90, subtotal: 180 },
    ],
    total: 370,
    status: 'aberta',
    criadaEm: '2026-05-15T09:24:00',
  },
  {
    id: 'n2', numero: '0011', clienteId: 'c2', clienteNome: 'Maria Ana Souza', clienteTelefone: '(11) 98888-0002',
    itens: [
      { id: 'i4', servicoId: 's4', nome: 'Manutenção completa', quantidade: 1, precoUnitario: 180, subtotal: 180 },
      { id: 'i5', servicoId: 's5', nome: 'Polimento', quantidade: 1, precoUnitario: 40, subtotal: 40 },
    ],
    total: 220,
    status: 'finalizada',
    criadaEm: '2026-05-14T15:10:00',
    finalizadaEm: '2026-05-14T18:42:00',
  },
  {
    id: 'n3', numero: '0010', clienteId: 'c3', clienteNome: 'Carlos Lima', clienteTelefone: '(11) 97777-0003',
    itens: [
      { id: 'i6', servicoId: 's2', nome: 'Copping', quantidade: 1, precoUnitario: 70, subtotal: 70 },
    ],
    total: 70,
    status: 'cancelada',
    criadaEm: '2026-05-13T11:30:00',
    canceladaEm: '2026-05-13T12:00:00',
  },
  {
    id: 'n4', numero: '0009', clienteId: 'c1', clienteNome: 'João da Silva', clienteTelefone: '(11) 99999-0001',
    itens: [
      { id: 'i7', servicoId: 's6', nome: 'Limpeza profunda', quantidade: 1, precoUnitario: 65, subtotal: 65 },
      { id: 'i8', servicoId: 's5', nome: 'Polimento', quantidade: 2, precoUnitario: 40, subtotal: 80 },
    ],
    total: 145,
    status: 'finalizada',
    criadaEm: '2026-05-12T08:15:00',
    finalizadaEm: '2026-05-12T10:30:00',
  },
  {
    id: 'n5', numero: '0008', clienteId: 'c4', clienteNome: 'Patrícia Mendes', clienteTelefone: '(11) 96666-0004',
    itens: [
      { id: 'i9', servicoId: 's1', nome: 'Aplicação de porcelana', quantidade: 3, precoUnitario: 90, subtotal: 270 },
    ],
    total: 270,
    status: 'aberta',
    criadaEm: '2026-05-11T14:00:00',
  },
];

const empresa = {
  nome: 'Acabamentos Premium',
  telefone: '(11) 4002-8922',
  proximaNota: '0013',
};

const statusLabel = {
  aberta: 'Aberta',
  finalizada: 'Finalizada',
  cancelada: 'Cancelada',
  rascunho: 'Rascunho',
  ativo: 'Ativo',
  inativo: 'Inativo',
};

const statusStyle = {
  aberta: 'bg-amber-100 text-amber-700',
  finalizada: 'bg-green-100 text-green-700',
  cancelada: 'bg-red-100 text-red-700',
  rascunho: 'bg-slate-100 text-slate-700',
  ativo: 'bg-green-100 text-green-700',
  inativo: 'bg-slate-200 text-slate-600',
  info: 'bg-blue-100 text-blue-700',
};

Object.assign(window, {
  fmtBRL, initialServicos, initialClientes, initialNotas, empresa, statusLabel, statusStyle,
});
