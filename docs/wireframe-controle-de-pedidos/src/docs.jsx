// Documentation tabs: Overview, Screens gallery, Flows, Architecture

// ============================
// Overview tab
// ============================
function OverviewTab({ onJumpTab }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 lg:p-10">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Wireframes &amp; protótipo</p>
        <h1 className="mt-2 text-4xl lg:text-5xl font-bold tracking-tight text-slate-950">Controle de Pedidos</h1>
        <p className="mt-4 max-w-3xl text-lg leading-7 text-slate-600">
          App mobile minimalista para pequenos prestadores de serviço cadastrarem clientes,
          serviços, criarem notas com itens, finalizarem pedidos e compartilharem PDFs.
        </p>

        <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <SpecCard label="Plataforma" value="React Native + Expo" />
          <SpecCard label="Estilo" value="NativeWind (Tailwind)" />
          <SpecCard label="Navegação" value="Bottom Tabs + Stack" />
          <SpecCard label="Linguagem" value="TypeScript" />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => onJumpTab('prototype')} className="h-11 px-5 rounded-xl bg-blue-600 text-white font-bold text-sm active:scale-[0.98] flex items-center gap-2">
            <Icon name="phone" className="w-4 h-4" /> Abrir protótipo interativo
          </button>
          <button onClick={() => onJumpTab('screens')} className="h-11 px-5 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-sm active:bg-slate-50">
            Ver todas as 12 telas
          </button>
        </div>
      </div>

      {/* Pillars */}
      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Clareza', desc: 'Cliente, status, total e número da nota sempre visíveis.' },
          { title: 'Rapidez', desc: 'Criar, salvar, finalizar e gerar PDF em poucos toques.' },
          { title: 'Confiança', desc: 'Feedback claro em todas as ações importantes.' },
          { title: 'Minimalismo', desc: 'Poucas cores, espaçamento generoso, componentes consistentes.' },
        ].map(p => (
          <div key={p.title} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="font-bold text-slate-950">{p.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Visual identity */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-slate-950 mb-4">Identidade visual</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="wf-annotation mb-3">Primária</p>
            <ColorSwatch hex="#1D4ED8" name="blue-600" />
            <ColorSwatch hex="#1E40AF" name="blue-700" />
            <ColorSwatch hex="#DBEAFE" name="blue-100" />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="wf-annotation mb-3">Neutros</p>
            <ColorSwatch hex="#F8FAFC" name="slate-50" />
            <ColorSwatch hex="#FFFFFF" name="white" border />
            <ColorSwatch hex="#E2E8F0" name="slate-200" />
            <ColorSwatch hex="#0F172A" name="slate-950" />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="wf-annotation mb-3">Semânticas</p>
            <ColorSwatch hex="#16A34A" name="green-600 / success" />
            <ColorSwatch hex="#F59E0B" name="amber-500 / warning" />
            <ColorSwatch hex="#DC2626" name="red-600 / danger" />
          </div>
        </div>
      </div>

      {/* Tokens */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-slate-950 mb-4">Tokens NativeWind</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <TokenBlock title="Layout">
            <TokenRow name="Screen" value="flex-1 bg-slate-50" />
            <TokenRow name="Scroll content" value="px-4 py-6 gap-4" />
            <TokenRow name="Card" value="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" />
            <TokenRow name="Divider" value="border-t border-slate-100 pt-4" />
          </TokenBlock>
          <TokenBlock title="Tipografia">
            <TokenRow name="Title" value="text-2xl font-bold text-slate-950" />
            <TokenRow name="Subtitle" value="text-sm text-slate-500" />
            <TokenRow name="Money" value="text-lg font-bold text-blue-600" />
            <TokenRow name="Annotation" value="text-[10px] uppercase font-bold text-slate-500" />
          </TokenBlock>
          <TokenBlock title="Forms">
            <TokenRow name="Input" value="h-12 rounded-xl border border-slate-200 bg-white px-4" />
            <TokenRow name="Input focused" value="border-blue-500 ring-2 ring-blue-100" />
            <TokenRow name="Input error" value="border-red-400" />
            <TokenRow name="TextArea" value="rounded-xl border border-slate-200 px-3 py-3" />
          </TokenBlock>
          <TokenBlock title="Buttons">
            <TokenRow name="Primary" value="h-12 rounded-xl bg-blue-600 text-white font-semibold" />
            <TokenRow name="Secondary" value="h-12 rounded-xl border border-slate-200 bg-white" />
            <TokenRow name="Destructive" value="h-12 rounded-xl bg-red-600 text-white" />
            <TokenRow name="Ghost" value="text-blue-600 active:bg-blue-50" />
          </TokenBlock>
        </div>
      </div>
    </div>
  );
}

function SpecCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-900">{value}</p>
    </div>
  );
}
function ColorSwatch({ hex, name, border }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span
        className={`w-10 h-10 rounded-xl shrink-0 ${border ? 'border border-slate-200' : ''}`}
        style={{ background: hex }}
      ></span>
      <div className="min-w-0">
        <p className="font-semibold text-sm text-slate-900">{name}</p>
        <p className="mono text-[11px] text-slate-500">{hex}</p>
      </div>
    </div>
  );
}
function TokenBlock({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="font-bold text-slate-900 mb-3">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function TokenRow({ name, value }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="font-semibold text-slate-900 shrink-0 min-w-[110px]">{name}</span>
      <code className="mono text-[12px] text-slate-600 break-all">{value}</code>
    </div>
  );
}

// ============================
// Screens tab — gallery of every screen with annotations
// ============================
const SCREEN_DOCS = [
  {
    id: 'dashboard',
    name: '01 · Dashboard / Início',
    goal: 'Visão geral do dia. Métricas rápidas + atalho para criar nota.',
    components: ['DashboardMetricCard', 'NotaCard', 'Button primário'],
    states: ['default', 'sem notas hoje', 'erro de carregamento'],
    nav: 'Entrada: tab Início. Saída: → Nova nota, → Notas, → Clientes, → Relatórios.',
    data: 'notas (status, criadaEm, total), usuário',
  },
  {
    id: 'notes-list',
    name: '02 · Lista de Notas',
    goal: 'Encontrar e abrir notas. Filtrar por status e buscar por cliente/número.',
    components: ['SearchInput', 'FilterChips', 'NotaCard', 'EmptyState / LoadingState / ErrorState'],
    states: ['populated', 'loading', 'empty', 'no-results', 'filtering', 'error'],
    nav: 'Entrada: tab Notas. Saída: → Detalhe da nota, → Criar nota.',
    data: 'notas filtradas',
  },
  {
    id: 'create-note',
    name: '03 · Criar / Editar Nota',
    goal: 'Capturar dados do cliente, itens e total. Salvar como aberta ou finalizar.',
    components: ['Input', 'TextArea', 'NotaItemRow', 'NotaTotalCard', 'FooterActions', 'ConfirmDialog (descartar)'],
    states: ['vazio', 'preenchendo', 'validação', 'saving', 'descartar'],
    nav: 'Entrada: tab + (FAB) ou Editar a partir do detalhe. Saída: → Adicionar item, → Detalhe (após finalizar), pop.',
    data: 'draftNote (clienteNome, telefone, observacao, itens[], total)',
    rules: 'clienteNome obrigatório. Pelo menos 1 item. Cancelar com itens dispara confirmação.',
  },
  {
    id: 'add-item',
    name: '04 · Adicionar item (Selecionar serviço)',
    goal: 'Escolher um serviço ativo, definir quantidade e adicionar à nota.',
    components: ['SearchInput', 'ServicoCard (selecionável)', 'Stepper de quantidade', 'Button "Adicionar à nota"'],
    states: ['nenhum selecionado', 'serviço selecionado', 'sem resultados', 'sem serviços'],
    nav: 'Entrada: a partir de Criar nota. Saída: pop (volta com item adicionado).',
    data: 'serviços ativos, item temporário',
  },
  {
    id: 'note-details',
    name: '05 · Detalhe da Nota',
    goal: 'Revisar a nota completa e executar ações (editar, finalizar, PDF, cancelar).',
    components: ['Badge status', 'NotaItemRow', 'NotaTotalCard', 'BottomSheet de ações', 'ConfirmDialog'],
    states: ['aberta', 'finalizada', 'cancelada'],
    nav: 'Entrada: NotesList, Dashboard, ClientDetails. Saída: → Editar, → PDF Preview.',
    data: 'nota por id',
    rules: 'Cancelar nota exige confirmação. Finalizar grava finalizadaEm.',
  },
  {
    id: 'pdf-preview',
    name: '06 · Prévia do PDF',
    goal: 'Mostrar como o recibo ficará. Baixar ou compartilhar.',
    components: ['Recibo (header escuro, lista pontilhada, total destacado)', 'Button baixar/compartilhar'],
    states: ['gerando', 'pronto'],
    nav: 'Entrada: detalhe da nota. Saída: pop.',
    data: 'nota + dados da empresa',
  },
  {
    id: 'services-list',
    name: '07 · Lista de Serviços',
    goal: 'Gerenciar o catálogo de serviços. Filtrar ativos/inativos.',
    components: ['SearchInput', 'FilterChips', 'ServicoCard', 'Button criar'],
    states: ['populated', 'empty (criar primeiro)', 'sem resultados'],
    nav: 'Entrada: tab Serviços. Saída: → Novo serviço, → Editar serviço.',
    data: 'serviços filtrados por status + busca',
  },
  {
    id: 'service-form',
    name: '08 · Criar / Editar Serviço',
    goal: 'Cadastrar ou alterar um serviço com nome, descrição, preço e status.',
    components: ['Input', 'TextArea', 'Input com prefixo R$', 'Toggle ativo/inativo', 'FooterActions', 'ConfirmDialog excluir'],
    states: ['criando', 'editando', 'validação', 'salvando', 'excluindo'],
    nav: 'Entrada: ServicesList. Saída: pop.',
    data: 'servico (nome, descricao, preco, status)',
    rules: 'Nome obrigatório. Preço > 0. Exclusão exige confirmação.',
  },
  {
    id: 'clients-list',
    name: '09 · Clientes',
    goal: 'Listar clientes derivados das notas, com total gasto e contagem.',
    components: ['SearchInput', 'ClienteCard'],
    states: ['populated', 'empty', 'sem resultados'],
    nav: 'Entrada: atalho do Dashboard. Saída: → Detalhe do cliente.',
    data: 'clientes + notas agregadas por clienteId',
  },
  {
    id: 'client-details',
    name: '10 · Detalhe do Cliente',
    goal: 'Histórico do cliente. Atalho para criar nova nota já com cliente preenchido.',
    components: ['Resumo (total + notas)', 'NotaCard (histórico)', 'Button "Nova nota para ..."'],
    states: ['com histórico', 'sem histórico'],
    nav: 'Entrada: ClientsList. Saída: → Detalhe da nota, → Criar nota (pré-preenchida).',
    data: 'cliente + notas filtradas por clienteId',
  },
  {
    id: 'reports',
    name: '11 · Relatórios',
    goal: 'Resumo financeiro e operacional. Exportar PDF.',
    components: ['FilterChips (período)', 'Hero faturamento', 'Métricas por status', 'Barras de progresso', 'Top serviços'],
    states: ['com dados', 'sem dados no período'],
    nav: 'Entrada: atalho do Dashboard. Saída: pop / exportar.',
    data: 'agregação de notas e itens no período',
  },
  {
    id: 'settings',
    name: '12 · Ajustes',
    goal: 'Configurar empresa, numeração, modelo de PDF e dados locais.',
    components: ['Section list', 'Linha agrupada', 'Toggle (futuro)', 'ConfirmDialog destrutivo'],
    states: ['default', 'limpando dados'],
    nav: 'Entrada: tab Ajustes. Saída: telas internas (futuras).',
    data: 'empresa, preferências locais',
    rules: 'Limpar dados locais é destrutivo e exige confirmação.',
  },
];

function ScreensTab() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-950">Todas as telas</h2>
        <p className="mt-2 text-slate-600 max-w-2xl">
          12 telas principais agrupadas por módulo. Cada cartão mostra o wireframe em tamanho real
          (mobile) com a anotação técnica ao lado.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {SCREEN_DOCS.map(doc => (
          <ScreenDocCard key={doc.id} doc={doc} />
        ))}
      </div>
    </div>
  );
}

function ScreenDocCard({ doc }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 lg:p-6">
      <div className="grid md:grid-cols-[290px_1fr] gap-6">
        <div className="flex justify-center">
          <div className="phone-static">
            <div className="phone-static-screen overflow-hidden relative">
              <ScreenPreview id={doc.id} />
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <p className="wf-annotation">{doc.id}</p>
          <h3 className="mt-1 text-xl font-bold text-slate-950">{doc.name.split(' · ')[1] || doc.name}</h3>
          <p className="mt-2 text-sm text-slate-600 leading-6">{doc.goal}</p>

          <div className="mt-4 space-y-3 text-sm">
            <DocRow label="Componentes" items={doc.components} />
            <DocRow label="Estados" items={doc.states} pill />
            {doc.rules && <DocRow label="Regras" text={doc.rules} />}
            <DocRow label="Navegação" text={doc.nav} />
            <DocRow label="Dados" text={doc.data} mono />
          </div>
        </div>
      </div>
    </div>
  );
}

function DocRow({ label, items, text, pill, mono }) {
  return (
    <div>
      <p className="wf-annotation mb-1.5">{label}</p>
      {items ? (
        <div className="flex flex-wrap gap-1.5">
          {items.map(it => (
            <span key={it} className={`text-xs px-2 py-0.5 rounded ${pill ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'} font-medium`}>{it}</span>
          ))}
        </div>
      ) : (
        <p className={`text-sm text-slate-700 ${mono ? 'mono text-[12px] text-slate-600' : ''}`}>{text}</p>
      )}
    </div>
  );
}

// Small static preview for each screen — uses the real prototype components
function ScreenPreview({ id }) {
  // Build a fully working but isolated mini-instance for preview
  const [previewState] = useState({
    servicos: initialServicos,
    clientes: initialClientes,
    notas: initialNotas,
  });

  const noop = () => {};
  const fakeProps = {
    push: noop, pop: noop, popTo: noop, switchTab: noop, showToast: noop,
    servicos: previewState.servicos, setServicos: noop,
    clientes: previewState.clientes, setClientes: noop,
    notas: previewState.notas, setNotas: noop,
    proximoNumero: 13, setProximoNumero: noop,
    draftNote: id === 'create-note' ? {
      id: 'd', numero: '0013', clienteNome: 'João da Silva',
      clienteTelefone: '(11) 99999-0001', observacao: '',
      itens: [
        { id: 'i1', servicoId: 's2', nome: 'Copping', quantidade: 2, precoUnitario: 70, subtotal: 140 },
      ],
      total: 140, status: 'rascunho',
    } : null,
    setDraftNote: noop,
    params: id === 'note-details' || id === 'pdf-preview' ? { id: 'n1' }
          : id === 'client-details' ? { id: 'c1' }
          : id === 'service-form' ? { mode: 'edit', id: 's1' } : {},
  };

  const Comp = {
    'dashboard': DashboardScreen,
    'notes-list': NotesListScreen,
    'create-note': CreateNoteScreen,
    'add-item': AddNoteItemScreen,
    'note-details': NoteDetailsScreen,
    'pdf-preview': PdfPreviewScreen,
    'services-list': ServicesListScreen,
    'service-form': ServiceFormScreen,
    'clients-list': ClientsListScreen,
    'client-details': ClientDetailsScreen,
    'reports': ReportsScreen,
    'settings': SettingsScreen,
  }[id];

  if (!Comp) return null;
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Comp {...fakeProps} />
    </div>
  );
}

// ============================
// Flows tab
// ============================
function FlowsTab() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-950">Fluxos &amp; navegação</h2>
        <p className="mt-2 text-slate-600 max-w-2xl">Mapa visual da navegação e os 5 fluxos principais do usuário.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 mb-10">
        <h3 className="text-xl font-bold mb-5">Mapa de navegação</h3>
        <NavigationMap />
      </div>

      <h3 className="text-2xl font-bold mb-4">Fluxos do usuário</h3>
      <div className="space-y-4">
        <FlowCard
          n="1"
          title="Criar nota e compartilhar PDF"
          steps={['Início', 'Nova nota (FAB)', 'Preencher cliente', 'Adicionar item', 'Selecionar serviço', 'Definir quantidade', 'Revisar total', 'Finalizar', 'PDF Preview', 'Compartilhar']}
          accent="blue"
        />
        <FlowCard
          n="2"
          title="Gerenciar serviços"
          steps={['Tab Serviços', 'Buscar / filtrar', 'Novo serviço', 'Preencher dados', 'Salvar', 'Toast de sucesso']}
          accent="green"
        />
        <FlowCard
          n="3"
          title="Consultar nota existente"
          steps={['Tab Notas', 'Buscar ou filtrar', 'Abrir nota', 'Revisar', 'Gerar PDF', 'Compartilhar']}
          accent="slate"
        />
        <FlowCard
          n="4"
          title="Histórico do cliente"
          steps={['Atalho Clientes', 'Buscar cliente', 'Abrir histórico', 'Ver nota antiga ou criar nova']}
          accent="blue"
        />
        <FlowCard
          n="5"
          title="Relatórios"
          steps={['Atalho Relatórios', 'Escolher período', 'Visualizar resumo', 'Exportar PDF']}
          accent="green"
        />
      </div>
    </div>
  );
}

function NavigationMap() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="inline-block rounded-xl bg-slate-900 text-white px-4 py-2 font-bold text-sm">App Navigator</div>
      </div>
      <div className="flex justify-center">
        <div className="w-px h-6 bg-slate-300"></div>
      </div>
      <div className="text-center">
        <div className="inline-block rounded-xl bg-blue-600 text-white px-4 py-2 font-bold text-sm">Bottom Tabs</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-2 relative">
        <StackColumn name="Início" stack={['DashboardScreen']} root />
        <StackColumn name="Notas" stack={['NotesList', 'CreateNote', 'AddNoteItem', 'NoteDetails', 'PdfPreview']} />
        <div className="flex flex-col items-center justify-start pt-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
            <Icon name="plus" className="w-5 h-5" />
          </div>
          <p className="mt-2 text-[10px] font-bold uppercase text-slate-500">FAB</p>
          <p className="text-[11px] text-slate-600 text-center mt-1">Cria nota nova<br/>(abre CreateNote)</p>
        </div>
        <StackColumn name="Serviços" stack={['ServicesList', 'CreateService', 'EditService']} />
        <StackColumn name="Ajustes" stack={['SettingsScreen']} root />
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Acessados via atalhos (não-tabs)</p>
        <div className="grid md:grid-cols-2 gap-3">
          <StackColumn name="ClientsStack" stack={['ClientsList', 'ClientDetails']} compact />
          <StackColumn name="ReportsStack" stack={['ReportsScreen']} compact />
        </div>
      </div>
    </div>
  );
}

function StackColumn({ name, stack, root, compact }) {
  return (
    <div className={compact ? '' : 'text-center'}>
      <div className={`inline-block rounded-lg bg-slate-100 text-slate-900 px-3 py-1.5 font-bold text-xs ${compact ? '' : ''}`}>
        {name} {!root && <span className="text-slate-500">Stack</span>}
      </div>
      <div className={`mt-2 space-y-1.5 ${compact ? 'flex flex-wrap gap-1.5 mt-2' : ''}`}>
        {stack.map((s, i) => (
          <div key={s} className={`${compact ? 'inline-block' : ''} rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700`}>
            {compact ? s : `${i + 1}. ${s}`}
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowCard({ n, title, steps, accent = 'blue' }) {
  const accents = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-xl ${accents[accent]} border font-bold flex items-center justify-center`}>{n}</div>
        <h4 className="font-bold text-slate-900">{title}</h4>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${accents[accent]} border`}>{s}</div>
            {i < steps.length - 1 && <Icon name="arrow-right" className="w-3 h-3 text-slate-400" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ============================
// Architecture tab
// ============================
function ArchitectureTab() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <div>
        <h2 className="text-3xl font-bold text-slate-950">Arquitetura</h2>
        <p className="mt-2 text-slate-600 max-w-2xl">Estrutura de pastas, tipos do domínio e recomendações de implementação para o React Native real.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold mb-3">Estrutura de pastas</h3>
          <pre className="rounded-2xl bg-slate-950 text-slate-100 p-5 text-[12px] leading-6 mono overflow-x-auto">{`src/
  app/
    navigation/
      AppNavigator.tsx        — root navigator
      BottomTabs.tsx          — 5 tabs
      NotesStack.tsx
      ServicesStack.tsx
      ClientsStack.tsx
      ReportsStack.tsx

  shared/
    ui/
      Button.tsx              variantes + loading
      Input.tsx               focused/error/disabled
      TextArea.tsx
      Card.tsx                tappable/selected
      Badge.tsx               status
      MoneyText.tsx           BRL
      SearchInput.tsx         com clear
      Toggle.tsx
    components/
      EmptyState.tsx
      LoadingState.tsx
      ErrorState.tsx
      ScreenContainer.tsx     SafeAreaView + bg-slate-50
      ListScreenContainer.tsx FlatList wrapper
      SectionHeader.tsx
      FooterActions.tsx       botões fixos no rodapé
      ConfirmDialog.tsx       BottomSheet style
      BottomSheet.tsx
      Toast.tsx
    utils/
      currency.ts             fmtBRL
      date.ts                 formatadores
      ids.ts                  uuid mock
      validators.ts

  modules/
    dashboard/
      screens/DashboardScreen.tsx
      components/DashboardMetricCard.tsx

    notas/
      screens/
        NotesListScreen.tsx
        CreateNoteScreen.tsx
        NoteDetailsScreen.tsx
        AddNoteItemScreen.tsx
        PdfPreviewScreen.tsx
      components/
        NotaCard.tsx
        NotaStatusBadge.tsx
        NotaItemRow.tsx
        NotaTotalCard.tsx
      hooks/useNotas.ts
      types/nota.types.ts

    servicos/
      screens/ServicesListScreen.tsx
      screens/ServiceFormScreen.tsx
      components/ServicoCard.tsx
      hooks/useServicos.ts
      types/servico.types.ts

    clientes/
      screens/ClientsListScreen.tsx
      screens/ClientDetailsScreen.tsx
      components/ClienteCard.tsx
      types/cliente.types.ts

    relatorios/
      screens/ReportsScreen.tsx
      components/ReportSummaryCard.tsx

    settings/
      screens/SettingsScreen.tsx`}</pre>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-3">Tipos do domínio</h3>
          <pre className="rounded-2xl bg-slate-950 text-slate-100 p-5 text-[12px] leading-6 mono overflow-x-auto">{`type NotaStatus =
  | 'aberta'
  | 'finalizada'
  | 'cancelada'
  | 'rascunho';

type ServicoStatus = 'ativo' | 'inativo';

type Cliente = {
  id: string;
  nome: string;
  telefone?: string;
  criadoEm: string;
};

type Servico = {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  status: ServicoStatus;
  criadoEm: string;
  atualizadoEm?: string;
};

type NotaItem = {
  id: string;
  servicoId: string;
  nome: string;           // snapshot do nome
  quantidade: number;
  precoUnitario: number;  // snapshot do preço
  subtotal: number;
};

type Nota = {
  id: string;
  numero: string;         // ex: '0012'
  clienteId?: string;
  clienteNome: string;
  clienteTelefone?: string;
  observacao?: string;
  itens: NotaItem[];
  total: number;
  status: NotaStatus;
  criadaEm: string;       // ISO
  finalizadaEm?: string;
  canceladaEm?: string;
};

type Empresa = {
  nome: string;
  telefone?: string;
  logoUri?: string;
  proximoNumero: number;
};`}</pre>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Recomendações de implementação</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Listas com FlatList', body: 'NotesList, ServicesList, ClientsList → FlatList (nunca dentro de ScrollView). Use keyExtractor, ListEmptyComponent e ItemSeparatorComponent.' },
            { title: 'Formulários com ScrollView', body: 'CreateNote, ServiceForm, Settings → ScrollView + KeyboardAvoidingView. Use FooterActions fixo no rodapé.' },
            { title: 'SafeAreaView sempre', body: 'Toda screen começa em <SafeAreaView style={{flex:1, backgroundColor:"#F8FAFC"}}>.' },
            { title: 'Persistência local', body: 'Comece com useState; migre para Zustand/Redux + AsyncStorage. Tipos do domínio acima são serializáveis direto.' },
            { title: 'Geração de PDF', body: 'expo-print + expo-sharing. Layout em HTML simples reaproveitando o markup do PdfPreviewScreen.' },
            { title: 'Validação de formulário', body: 'react-hook-form + zod para tipagem forte. Mensagens curtas em pt-BR.' },
            { title: 'Acessibilidade', body: 'Targets ≥ 44pt. Labels claros em Badges. Confirmação obrigatória para destrutivos.' },
            { title: 'Performance', body: 'memo nos *Card. useMemo nos filtros de lista. Evite recriar arrays grandes a cada render.' },
          ].map(rec => (
            <div key={rec.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="font-bold text-slate-900">{rec.title}</p>
              <p className="mt-1.5 text-sm text-slate-600 leading-6">{rec.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Próximos passos para virar código RN</h3>
        <ol className="space-y-3">
          {[
            'expo init com template TypeScript blank. Instalar NativeWind, react-navigation/native, /bottom-tabs, /native-stack, expo-print, expo-sharing.',
            'Copiar tokens (cores, espaçamento, raios) para tailwind.config.js e configurar NativeWind.',
            'Criar pasta src/ conforme arquitetura. Implementar shared/ui primeiro (Button, Input, Card, Badge, Money).',
            'Definir os tipos do domínio em src/modules/*/types/. Criar mocks iniciais em src/shared/mocks/.',
            'Montar AppNavigator com BottomTabs. FAB central abre CreateNoteScreen como modal stack.',
            'Implementar tela por tela na ordem dos fluxos: Dashboard → NotesList → CreateNote → AddNoteItem → NoteDetails.',
            'Adicionar persistência com AsyncStorage. Adaptador único: src/shared/storage.ts.',
            'Implementar PdfPreviewScreen + geração via expo-print. Compartilhamento via expo-sharing.',
            'Validações com react-hook-form + zod. Toast com react-native-toast-message.',
            'QA em iOS + Android. Ajustar safe areas, teclado, e performance de listas.',
          ].map((step, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
              <span className="text-sm text-slate-700 leading-6">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

Object.assign(window, { OverviewTab, ScreensTab, FlowsTab, ArchitectureTab });
