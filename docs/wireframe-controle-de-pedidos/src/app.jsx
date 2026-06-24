// Main app shell — top-bar tabs to switch between Overview / Prototype / Screens / Components / Flows / Architecture

function App() {
  const [tab, setTab] = useState('overview');

  // Sync tab to URL hash for shareable deep links
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && tabs.some(t => t.id === hash)) setTab(hash);
    const onHash = () => {
      const h = window.location.hash.replace('#', '');
      if (h && tabs.some(t => t.id === h)) setTab(h);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (window.location.hash.replace('#', '') !== tab) {
      window.history.replaceState(null, '', '#' + tab);
    }
  }, [tab]);

  const tabs = [
    { id: 'overview', label: 'Visão geral' },
    { id: 'prototype', label: 'Protótipo interativo', highlight: true },
    { id: 'screens', label: 'Telas' },
    { id: 'components', label: 'Componentes' },
    { id: 'flows', label: 'Fluxos' },
    { id: 'architecture', label: 'Arquitetura' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Icon name="doc-text" className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 leading-none">Wireframes</p>
              <p className="text-sm font-bold text-slate-950 leading-tight">Controle de Pedidos</p>
            </div>
          </div>
          <nav className="flex-1 flex items-center gap-1 overflow-x-auto nice-scroll -mx-1 px-1">
            {tabs.map(t => (
              <button
                key={t.id}
                data-active={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`tab-btn shrink-0 rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap text-slate-600
                  ${t.highlight && tab !== t.id ? '!text-blue-600 bg-blue-50 hover:bg-blue-100' : ''}`}
              >
                {t.highlight && tab !== t.id && <span className="mr-1">▸</span>}
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main>
        {tab === 'overview' && <OverviewTab onJumpTab={setTab} />}
        {tab === 'prototype' && <PrototypeTab />}
        {tab === 'screens' && <ScreensTab />}
        {tab === 'components' && <ComponentsGallery />}
        {tab === 'flows' && <FlowsTab />}
        {tab === 'architecture' && <ArchitectureTab />}
      </main>

      <footer className="border-t border-slate-200 bg-white mt-10">
        <div className="max-w-7xl mx-auto px-6 py-6 text-xs text-slate-500 flex items-center justify-between flex-wrap gap-3">
          <p>Wireframes &amp; protótipo · React Native + Expo + NativeWind</p>
          <p className="mono">v1.0 · slate-50 · blue-600</p>
        </div>
      </footer>
    </div>
  );
}

function PrototypeTab() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <div className="order-2 lg:order-1 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">Protótipo interativo</h2>
            <p className="mt-2 text-slate-600 max-w-xl">
              Versão funcional do app. Crie notas, adicione itens, finalize, gere PDF, gerencie serviços e clientes — tudo em estado local, exatamente como será no React Native real.
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-5">
            <p className="font-bold text-slate-900 mb-3">Experimente os fluxos</p>
            <ol className="space-y-2.5 text-sm text-slate-700">
              <FlowHint n="1" text="Toque no FAB azul central para abrir uma nova nota." />
              <FlowHint n="2" text="Preencha o nome do cliente e toque em “+ Adicionar” para incluir itens." />
              <FlowHint n="3" text="Selecione um serviço, ajuste a quantidade e adicione à nota." />
              <FlowHint n="4" text="Toque em “Finalizar” → a nota vai pro detalhe → gere PDF e compartilhe." />
              <FlowHint n="5" text="Na tab Serviços, crie um novo serviço ou edite o preço de um existente." />
              <FlowHint n="6" text="No Dashboard, abra Clientes ou Relatórios pelos atalhos." />
            </ol>
          </div>

          <div className="rounded-2xl bg-blue-50 border border-blue-200 p-5">
            <div className="flex items-start gap-3">
              <Icon name="info" className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-blue-900">Estado é totalmente local</p>
                <p className="mt-1 text-sm text-blue-800 leading-6">
                  Tudo que você criar fica em memória até recarregar a página. Em React Native, a mesma arquitetura
                  + AsyncStorage transforma isso em persistência local.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-5">
            <p className="font-bold text-slate-900 mb-3">Tabs do app</p>
            <div className="grid grid-cols-5 gap-2 text-center">
              {[
                { icon: 'home', label: 'Início' },
                { icon: 'list', label: 'Notas' },
                { icon: 'plus', label: 'Nova', highlight: true },
                { icon: 'tag', label: 'Serviços' },
                { icon: 'settings', label: 'Ajustes' },
              ].map(t => (
                <div key={t.label} className={`rounded-xl p-2.5 ${t.highlight ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-700'}`}>
                  <Icon name={t.icon} className={`w-4 h-4 mx-auto ${t.highlight ? 'text-white' : 'text-blue-600'}`} />
                  <p className="mt-1 text-[10px] font-bold">{t.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 flex justify-center lg:sticky lg:top-24">
          <Prototype />
        </div>
      </div>
    </div>
  );
}

function FlowHint({ n, text }) {
  return (
    <li className="flex gap-3 items-start">
      <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">{n}</span>
      <span className="leading-6">{text}</span>
    </li>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
