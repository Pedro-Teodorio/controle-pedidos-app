// Interactive prototype — navigable mobile app with real state
// Stack-based navigation, bottom tabs, working CRUD

const TAB_HOME = 'home', TAB_NOTAS = 'notas', TAB_NEW = 'new', TAB_SERVICOS = 'servicos', TAB_AJUSTES = 'ajustes';

// Default screen for each tab
const TAB_ROOT_SCREEN = {
  [TAB_HOME]: 'dashboard',
  [TAB_NOTAS]: 'notes-list',
  [TAB_SERVICOS]: 'services-list',
  [TAB_AJUSTES]: 'settings',
};

function Prototype() {
  // Data state
  const [servicos, setServicos] = useState(initialServicos);
  const [clientes, setClientes] = useState(initialClientes);
  const [notas, setNotas] = useState(initialNotas);
  const [proximoNumero, setProximoNumero] = useState(13);

  // Navigation state
  const [tab, setTab] = useState(TAB_HOME);
  const [stack, setStack] = useState({ [TAB_HOME]: [{ name: 'dashboard' }] });
  const [navDirection, setNavDirection] = useState('forward');

  // Cross-screen ephemeral state
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);

  // Draft note state (used by CreateNote + AddItem flow)
  const [draftNote, setDraftNote] = useState(null);

  const currentStack = stack[tab] || [{ name: TAB_ROOT_SCREEN[tab] }];
  const currentScreen = currentStack[currentStack.length - 1];

  const push = useCallback((screen) => {
    setNavDirection('forward');
    setStack(s => ({ ...s, [tab]: [...(s[tab] || [{ name: TAB_ROOT_SCREEN[tab] }]), screen] }));
  }, [tab]);

  const pop = useCallback(() => {
    setNavDirection('back');
    setStack(s => {
      const cur = s[tab] || [];
      if (cur.length <= 1) return s;
      return { ...s, [tab]: cur.slice(0, -1) };
    });
  }, [tab]);

  const popTo = useCallback((screenName) => {
    setNavDirection('back');
    setStack(s => {
      const cur = s[tab] || [];
      const idx = cur.findIndex(sc => sc.name === screenName);
      if (idx === -1) return s;
      return { ...s, [tab]: cur.slice(0, idx + 1) };
    });
  }, [tab]);

  const switchTab = useCallback((newTab) => {
    if (newTab === TAB_NEW) {
      // Start a new note flow in the Notas tab
      setNavDirection('forward');
      setTab(TAB_NOTAS);
      setDraftNote({
        id: 'draft-' + Date.now(),
        numero: String(proximoNumero).padStart(4, '0'),
        clienteNome: '',
        clienteTelefone: '',
        observacao: '',
        itens: [],
        total: 0,
        status: 'rascunho',
      });
      setStack(s => ({
        ...s,
        [TAB_NOTAS]: [{ name: 'notes-list' }, { name: 'create-note', params: { mode: 'create' } }],
      }));
      return;
    }
    setNavDirection('forward');
    setTab(newTab);
    setStack(s => s[newTab] ? s : { ...s, [newTab]: [{ name: TAB_ROOT_SCREEN[newTab] }] });
  }, [proximoNumero]);

  // ============================
  // Render screen
  // ============================
  const screenProps = {
    // Nav
    push, pop, popTo, switchTab,
    showToast,
    // Data
    servicos, setServicos, clientes, setClientes, notas, setNotas,
    proximoNumero, setProximoNumero,
    draftNote, setDraftNote,
    // Current screen params
    params: currentScreen.params || {},
  };

  const screenComponents = {
    'dashboard': DashboardScreen,
    'notes-list': NotesListScreen,
    'create-note': CreateNoteScreen,
    'note-details': NoteDetailsScreen,
    'add-note-item': AddNoteItemScreen,
    'pdf-preview': PdfPreviewScreen,
    'services-list': ServicesListScreen,
    'service-form': ServiceFormScreen,
    'clients-list': ClientsListScreen,
    'client-details': ClientDetailsScreen,
    'reports': ReportsScreen,
    'settings': SettingsScreen,
  };

  const ScreenComp = screenComponents[currentScreen.name];
  const screenKey = tab + ':' + currentStack.map(s => s.name).join('>');

  return (
    <div className="phone-frame relative">
      <div className="phone-notch"></div>
      <div className="phone-screen">
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 h-10 flex justify-between items-end px-6 pb-1 z-30 pointer-events-none">
          <span className="text-[11px] font-semibold text-slate-900">9:41</span>
          <div className="flex items-center gap-1 text-slate-900">
            <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><rect x="0" y="6" width="2" height="4" rx="0.5"/><rect x="3" y="4" width="2" height="6" rx="0.5"/><rect x="6" y="2" width="2" height="8" rx="0.5"/><rect x="9" y="0" width="2" height="10" rx="0.5"/></svg>
            <svg width="20" height="10" viewBox="0 0 20 10" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="0.5" y="0.5" width="17" height="9" rx="2"/><rect x="2" y="2" width="14" height="6" rx="1" fill="currentColor"/><rect x="18" y="3" width="1.5" height="4" rx="0.5" fill="currentColor"/></svg>
          </div>
        </div>

        {/* Screen container */}
        <div
          key={screenKey}
          className={`absolute inset-0 pt-10 pb-16 ${navDirection === 'back' ? 'screen-enter-back' : 'screen-enter'}`}
        >
          {ScreenComp ? <ScreenComp {...screenProps} /> : (
            <div className="p-8 text-center text-slate-500">Tela não encontrada: {currentScreen.name}</div>
          )}
        </div>

        {/* Bottom tabs */}
        <BottomTabs current={tab} onChange={switchTab} stackDepth={currentStack.length} />

        {/* Toast (global) */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}

// ============================
// Bottom Tabs
// ============================
function BottomTabs({ current, onChange, stackDepth }) {
  // Hide bottom tabs on deep nested screens for immersive flows
  const items = [
    { key: TAB_HOME, label: 'Início', icon: 'home' },
    { key: TAB_NOTAS, label: 'Notas', icon: 'list' },
    { key: TAB_NEW, label: '', icon: 'plus', center: true },
    { key: TAB_SERVICOS, label: 'Serviços', icon: 'tag' },
    { key: TAB_AJUSTES, label: 'Ajustes', icon: 'settings' },
  ];
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-white border-t border-slate-200">
      <div className="flex items-stretch h-16 px-2">
        {items.map(it => {
          if (it.center) {
            return (
              <button
                key={it.key}
                onClick={() => onChange(it.key)}
                className="flex-1 flex items-center justify-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center -mt-3 shadow-lg shadow-blue-600/30 active:scale-95 transition-transform">
                  <Icon name="plus" className="w-6 h-6 text-white" />
                </div>
              </button>
            );
          }
          const active = current === it.key;
          return (
            <button
              key={it.key}
              onClick={() => onChange(it.key)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 ${active ? 'text-blue-600' : 'text-slate-400'}`}
            >
              <Icon name={it.icon} className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================
// Dashboard
// ============================
function DashboardScreen({ notas, push, switchTab }) {
  const hoje = new Date().toISOString().slice(0, 10);
  const abertas = notas.filter(n => n.status === 'aberta');
  const finalizadasHoje = notas.filter(n => n.status === 'finalizada' && (n.finalizadaEm || '').startsWith(hoje));
  const totalHoje = notas
    .filter(n => n.status !== 'cancelada' && (n.criadaEm || '').startsWith(hoje))
    .reduce((sum, n) => sum + n.total, 0);
  const recentes = [...notas].sort((a,b) => (b.criadaEm || '').localeCompare(a.criadaEm || '')).slice(0, 3);

  return (
    <div className="h-full overflow-y-auto nice-scroll px-4">
      {/* Greeting */}
      <div className="flex items-center justify-between pt-2 pb-5">
        <div>
          <p className="text-sm text-slate-500">Bom dia,</p>
          <h2 className="text-2xl font-bold text-slate-950">Pedro</h2>
        </div>
        <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">P</div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Abertas</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{abertas.length}</p>
          <p className="mt-1 text-[11px] text-amber-700">Aguardando</p>
        </Card>
        <Card className="p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Finalizadas hoje</p>
          <p className="mt-2 text-2xl font-bold text-green-600">{finalizadasHoje.length}</p>
          <p className="mt-1 text-[11px] text-slate-500">Concluídas</p>
        </Card>
      </div>

      {/* Hero total */}
      <div className="mt-3 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white shadow-sm shadow-blue-600/20">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Total do dia</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{fmtBRL(totalHoje)}</p>
            <p className="mt-1 text-xs opacity-80">{notas.filter(n => (n.criadaEm||'').startsWith(hoje)).length} notas hoje</p>
          </div>
          <Icon name="sparkle" className="w-6 h-6 opacity-60" />
        </div>
        <button
          onClick={() => switchTab(TAB_NEW)}
          className="mt-4 w-full h-11 rounded-xl bg-white text-blue-700 font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Icon name="plus" className="w-4 h-4" /> Nova nota
        </button>
      </div>

      {/* Quick access */}
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        <button onClick={() => push({ name: 'clients-list' })} className="rounded-2xl bg-white border border-slate-200 p-3 flex flex-col items-center gap-1.5 active:bg-slate-50">
          <Icon name="users" className="w-5 h-5 text-blue-600" />
          <span className="text-[11px] font-semibold text-slate-700">Clientes</span>
        </button>
        <button onClick={() => push({ name: 'reports' })} className="rounded-2xl bg-white border border-slate-200 p-3 flex flex-col items-center gap-1.5 active:bg-slate-50">
          <Icon name="chart" className="w-5 h-5 text-blue-600" />
          <span className="text-[11px] font-semibold text-slate-700">Relatórios</span>
        </button>
        <button onClick={() => switchTab(TAB_SERVICOS)} className="rounded-2xl bg-white border border-slate-200 p-3 flex flex-col items-center gap-1.5 active:bg-slate-50">
          <Icon name="tag" className="w-5 h-5 text-blue-600" />
          <span className="text-[11px] font-semibold text-slate-700">Serviços</span>
        </button>
      </div>

      {/* Recentes */}
      <div className="mt-5 flex items-center justify-between">
        <p className="font-bold text-slate-900">Recentes</p>
        <button onClick={() => switchTab(TAB_NOTAS)} className="text-xs font-bold text-blue-600 flex items-center gap-1">
          Ver todas <Icon name="chevron-right" className="w-3 h-3" />
        </button>
      </div>
      <div className="mt-2.5 space-y-2.5 pb-6">
        {recentes.map(n => (
          <NotaCard key={n.id} nota={n} onClick={() => push({ name: 'note-details', params: { id: n.id } })} />
        ))}
      </div>
    </div>
  );
}

// ============================
// Notas list
// ============================
function NotesListScreen({ notas, push, switchTab }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('todas');
  const [loadingState, setLoadingState] = useState(null); // null | 'loading' | 'error'

  const filtered = useMemo(() => {
    let list = [...notas];
    if (filter !== 'todas') list = list.filter(n => n.status === filter);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(n =>
        n.clienteNome.toLowerCase().includes(s) || n.numero.includes(s)
      );
    }
    return list.sort((a,b) => (b.criadaEm || '').localeCompare(a.criadaEm || ''));
  }, [notas, filter, search]);

  const counts = {
    todas: notas.length,
    aberta: notas.filter(n => n.status === 'aberta').length,
    finalizada: notas.filter(n => n.status === 'finalizada').length,
    cancelada: notas.filter(n => n.status === 'cancelada').length,
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4">
        <div className="flex items-center justify-between pt-2 pb-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Notas</h2>
            <p className="text-xs text-slate-500">Controle pedidos e recibos</p>
          </div>
          <button
            onClick={() => switchTab(TAB_NEW)}
            className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-600/20 active:scale-95"
          >
            <Icon name="plus" className="w-5 h-5" />
          </button>
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Cliente ou número da nota" />
        <div className="mt-3">
          <FilterChips
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'todas', label: 'Todas', count: counts.todas },
              { value: 'aberta', label: 'Abertas', count: counts.aberta },
              { value: 'finalizada', label: 'Finalizadas', count: counts.finalizada },
              { value: 'cancelada', label: 'Canceladas', count: counts.cancelada },
            ]}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto nice-scroll px-4 pt-3 pb-4">
        {loadingState === 'loading' && <LoadingState />}
        {loadingState === 'error' && <ErrorState onRetry={() => setLoadingState(null)} />}
        {!loadingState && filtered.length === 0 && (
          <EmptyState
            icon={search ? 'search' : 'inbox'}
            title={search ? 'Nenhuma nota encontrada' : 'Sem notas ainda'}
            description={search ? `Não encontramos "${search}".` : 'Crie a primeira nota para começar a registrar pedidos.'}
            action={!search ? 'Nova nota' : undefined}
            onAction={() => switchTab(TAB_NEW)}
          />
        )}
        {!loadingState && filtered.length > 0 && (
          <div className="space-y-2.5">
            {filtered.map(n => (
              <NotaCard key={n.id} nota={n} onClick={() => push({ name: 'note-details', params: { id: n.id } })} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NotaCard({ nota, onClick }) {
  return (
    <Card onClick={onClick} className="p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="wf-annotation text-[10px]">Nota #{nota.numero}</p>
          <p className="mt-0.5 font-semibold text-slate-900 truncate">{nota.clienteNome}</p>
          <p className="text-xs text-slate-500 mt-0.5">{nota.itens.length} {nota.itens.length === 1 ? 'item' : 'itens'} · {fmtDate(nota.criadaEm)}</p>
        </div>
        <Badge status={nota.status} />
      </div>
      <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">{nota.clienteTelefone || '—'}</span>
        <Money value={nota.total} />
      </div>
    </Card>
  );
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  if (sameDay) return 'Hoje · ' + d.toTimeString().slice(0,5);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Ontem · ' + d.toTimeString().slice(0,5);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

Object.assign(window, { Prototype, NotaCard, fmtDate, TAB_HOME, TAB_NOTAS, TAB_NEW, TAB_SERVICOS, TAB_AJUSTES });
