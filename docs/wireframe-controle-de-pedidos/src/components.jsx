// Components gallery — every base + domain component showcased with all states
function ComponentsGallery() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

      {/* Section: Buttons */}
      <Section
        title="Button"
        description="Variantes primária, secundária, destrutiva, ghost. Todos com h-12 rounded-xl + estados pressed/loading/disabled."
        spec="bg-blue-600 · h-12 · rounded-xl · font-semibold"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StateCell label="Primary">
            <Button variant="primary">Salvar nota</Button>
          </StateCell>
          <StateCell label="Secondary">
            <Button variant="secondary">Cancelar</Button>
          </StateCell>
          <StateCell label="Destructive">
            <Button variant="destructive">Excluir</Button>
          </StateCell>
          <StateCell label="Ghost">
            <Button variant="ghost">Ver mais</Button>
          </StateCell>
          <StateCell label="Loading">
            <Button variant="primary" loading>Carregando</Button>
          </StateCell>
          <StateCell label="Disabled">
            <Button variant="primary" disabled>Indisponível</Button>
          </StateCell>
          <StateCell label="Com ícone">
            <Button variant="primary" icon={<Icon name="plus" className="w-4 h-4" />}>Nova nota</Button>
          </StateCell>
          <StateCell label="Tamanho sm">
            <Button variant="primary" size="sm">Compacto</Button>
          </StateCell>
        </div>
      </Section>

      {/* Section: Inputs */}
      <Section
        title="Input / TextArea"
        description="Campos com estados default, focused (com ring azul), filled, error e disabled."
        spec="h-12 · border-slate-200 · focus:border-blue-500 + ring-2 ring-blue-100"
      >
        <div className="grid md:grid-cols-2 gap-5">
          <StateCell label="Default" wide>
            <Input label="Nome do cliente" placeholder="Nome completo" />
          </StateCell>
          <StateCell label="Filled" wide>
            <InputDemo initial="João da Silva" label="Nome do cliente" />
          </StateCell>
          <StateCell label="Error" wide>
            <Input label="Preço" placeholder="0,00" prefix="R$" error="Informe um preço válido" />
          </StateCell>
          <StateCell label="Disabled" wide>
            <Input label="Telefone" value="(11) 99999-0000" disabled />
          </StateCell>
          <StateCell label="Com prefixo" wide>
            <Input label="Preço" placeholder="0,00" prefix="R$" hint="Em reais" />
          </StateCell>
          <StateCell label="TextArea" wide>
            <TextArea label="Observação" placeholder="Anotações sobre o pedido" rows={3} />
          </StateCell>
        </div>
      </Section>

      {/* Section: Badge */}
      <Section
        title="Badge / Status"
        description="Badges semânticas para status de nota e serviço."
        spec="rounded-full · px-2.5 py-1 · text-[10px] uppercase tracking-wide"
      >
        <div className="flex flex-wrap gap-2">
          <Badge status="aberta" />
          <Badge status="finalizada" />
          <Badge status="cancelada" />
          <Badge status="rascunho" />
          <Badge status="ativo" />
          <Badge status="inativo" />
          <Badge status="info">Em revisão</Badge>
        </div>
      </Section>

      {/* Section: Card */}
      <Section
        title="Card"
        description="Container base. Estados default, pressed, selected, disabled."
        spec="rounded-2xl · border-slate-200 · bg-white · p-4 · shadow-sm"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StateCell label="Default" wide>
            <Card>
              <p className="font-semibold">Card padrão</p>
              <p className="text-xs text-slate-500 mt-1">Conteúdo</p>
            </Card>
          </StateCell>
          <StateCell label="Tappable" wide>
            <Card onClick={() => {}}>
              <p className="font-semibold">Card clicável</p>
              <p className="text-xs text-slate-500 mt-1">Toque pra ver</p>
            </Card>
          </StateCell>
          <StateCell label="Selected" wide>
            <Card onClick={() => {}} selected>
              <p className="font-semibold">Card selecionado</p>
              <p className="text-xs text-slate-500 mt-1">Ring azul</p>
            </Card>
          </StateCell>
          <StateCell label="Disabled" wide>
            <Card disabled>
              <p className="font-semibold">Card desabilitado</p>
              <p className="text-xs text-slate-500 mt-1">opacity-50</p>
            </Card>
          </StateCell>
        </div>
      </Section>

      {/* Section: SearchInput + Filters */}
      <Section
        title="SearchInput + Filter Chips"
        description="Estados: vazio, digitando, com resultados, sem resultados."
        spec="h-11 · ícone search + clear button"
      >
        <div className="grid md:grid-cols-2 gap-5">
          <StateCell label="Vazio" wide>
            <SearchInput value="" onChange={()=>{}} placeholder="Buscar cliente" />
          </StateCell>
          <StateCell label="Com texto" wide>
            <SearchInput value="João" onChange={()=>{}} placeholder="Buscar cliente" />
          </StateCell>
          <StateCell label="Filtros únicos" wide>
            <FilterChipsDemo />
          </StateCell>
          <StateCell label="Com contadores" wide>
            <FilterChipsDemo withCounts />
          </StateCell>
        </div>
      </Section>

      {/* Section: Money */}
      <Section
        title="MoneyText"
        description="Formatação BRL consistente. Tamanhos sm/md/lg/xl."
        spec="font-bold · text-blue-600 · Intl.NumberFormat('pt-BR')"
      >
        <div className="flex flex-wrap items-baseline gap-6">
          <Money value={49.9} size="sm" />
          <Money value={180} size="md" />
          <Money value={1290.5} size="lg" />
          <Money value={8420} size="xl" />
        </div>
      </Section>

      {/* Section: States */}
      <Section
        title="Estados de tela (Empty / Loading / Error)"
        description="Padrão consistente em todas as listas e telas vazias."
        spec="EmptyState · LoadingState (skeleton) · ErrorState (banner vermelho)"
      >
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <EmptyState
              icon="inbox"
              title="Sem notas ainda"
              description="Crie a primeira nota para começar"
              action="Nova nota"
              onAction={()=>{}}
            />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <LoadingState />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <ErrorState onRetry={()=>{}} />
          </div>
        </div>
      </Section>

      {/* Section: Domain components */}
      <Section
        title="Componentes de domínio"
        description="Cards específicos do app, montados sobre os primitivos."
        spec="NotaCard · ServicoCard · ClienteCard · DashboardMetricCard · NotaItemRow · NotaTotalCard"
      >
        <div className="grid lg:grid-cols-2 gap-4">
          <DomainBlock label="NotaCard — aberta">
            <NotaCard nota={initialNotas[0]} onClick={()=>{}} />
          </DomainBlock>
          <DomainBlock label="NotaCard — finalizada">
            <NotaCard nota={initialNotas[1]} onClick={()=>{}} />
          </DomainBlock>
          <DomainBlock label="NotaCard — cancelada">
            <NotaCard nota={initialNotas[2]} onClick={()=>{}} />
          </DomainBlock>
          <DomainBlock label="ServicoCard">
            <Card onClick={()=>{}} className="p-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 truncate">Aplicação de porcelana</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">Acabamento premium</p>
                </div>
                <Badge status="ativo" />
              </div>
              <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <Money value={90} />
                <span className="text-xs font-bold text-blue-600">Editar →</span>
              </div>
            </Card>
          </DomainBlock>
          <DomainBlock label="ClienteCard">
            <Card onClick={()=>{}} className="p-3.5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 truncate">João da Silva</p>
                  <p className="text-xs text-slate-500 mt-0.5">5 notas · Última hoje</p>
                </div>
                <div className="text-right shrink-0">
                  <Money value={920} size="sm" />
                  <p className="text-[10px] text-slate-400 mt-0.5">Total</p>
                </div>
              </div>
            </Card>
          </DomainBlock>
          <DomainBlock label="DashboardMetricCard">
            <Card className="p-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Finalizadas hoje</p>
              <p className="mt-2 text-2xl font-bold text-green-600">8</p>
              <p className="mt-1 text-[11px] text-slate-500">+2 vs ontem</p>
            </Card>
          </DomainBlock>
          <DomainBlock label="NotaItemRow">
            <div className="rounded-xl bg-slate-50 p-3 flex items-center gap-3">
              <div className="flex-1">
                <p className="font-semibold text-sm">Copping</p>
                <p className="text-xs text-slate-500">2 × R$ 70,00</p>
              </div>
              <p className="font-bold text-sm">R$ 140,00</p>
            </div>
          </DomainBlock>
          <DomainBlock label="NotaTotalCard">
            <div className="rounded-2xl bg-blue-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Total</p>
                <p className="text-2xl font-bold tracking-tight">R$ 370,00</p>
              </div>
            </div>
          </DomainBlock>
        </div>
      </Section>

      {/* Section: Overlays */}
      <Section
        title="Overlays — Toast, BottomSheet, ConfirmDialog"
        description="Feedback e ações modais sempre ancorados ao bottom da tela."
        spec="rounded-t-3xl · sheet-enter animation · backdrop slate-900/40"
      >
        <div className="grid md:grid-cols-3 gap-4">
          <DomainBlock label="Toast — sucesso">
            <div className="bg-green-600 text-white rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2">
              <Icon name="check" className="w-4 h-4" /> Nota finalizada
            </div>
          </DomainBlock>
          <DomainBlock label="Toast — erro">
            <div className="bg-red-600 text-white rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2">
              <Icon name="alert" className="w-4 h-4" /> Verifique os campos
            </div>
          </DomainBlock>
          <DomainBlock label="Toast — info">
            <div className="bg-slate-800 text-white rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2">
              <Icon name="info" className="w-4 h-4" /> Dados limpos
            </div>
          </DomainBlock>
          <DomainBlock label="ConfirmDialog — destrutivo" wide>
            <div className="rounded-2xl bg-white shadow-lg ring-1 ring-slate-200 p-5">
              <p className="font-bold text-slate-900 text-lg">Cancelar esta nota?</p>
              <p className="mt-1.5 text-sm text-slate-500">A nota será marcada como cancelada. Essa ação não pode ser desfeita.</p>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <Button variant="secondary">Voltar</Button>
                <Button variant="destructive">Cancelar nota</Button>
              </div>
            </div>
          </DomainBlock>
          <DomainBlock label="BottomSheet — ações da nota" wide>
            <div className="rounded-t-3xl bg-white shadow-lg ring-1 ring-slate-200 p-5 -mb-5">
              <div className="mx-auto w-10 h-1 rounded-full bg-slate-200 mb-3"></div>
              <p className="font-bold text-slate-900 mb-3">Ações da nota</p>
              <div className="space-y-1">
                <SheetItemDemo icon="edit" label="Editar nota" />
                <SheetItemDemo icon="share" label="Compartilhar PDF" />
                <SheetItemDemo icon="download" label="Baixar PDF" />
                <SheetItemDemo icon="trash" label="Cancelar nota" destructive />
              </div>
            </div>
          </DomainBlock>
        </div>
      </Section>

      {/* Section: Tab Bar */}
      <Section
        title="Tab Bar + FAB central"
        description="Bottom Tabs com 5 itens, sendo o central um FAB (cria nota)."
        spec="h-16 · border-t-slate-200 · FAB elevated com sombra"
      >
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-stretch h-16 px-2">
            <TabItem icon="home" label="Início" active />
            <TabItem icon="list" label="Notas" />
            <div className="flex-1 flex items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center -mt-3 shadow-lg shadow-blue-600/30">
                <Icon name="plus" className="w-6 h-6 text-white" />
              </div>
            </div>
            <TabItem icon="tag" label="Serviços" />
            <TabItem icon="settings" label="Ajustes" />
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, description, spec, children }) {
  return (
    <section>
      <div className="mb-5 flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-600 max-w-2xl">{description}</p>}
        </div>
        {spec && <code className="mono text-[11px] text-slate-500 bg-slate-100 px-2 py-1 rounded">{spec}</code>}
      </div>
      {children}
    </section>
  );
}

function StateCell({ label, children, wide }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="wf-annotation mb-3">{label}</p>
      <div className={wide ? '' : 'flex justify-center'}>{children}</div>
    </div>
  );
}

function DomainBlock({ label, children, wide }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-slate-50 p-4 ${wide ? 'lg:col-span-2' : ''}`}>
      <p className="wf-annotation mb-3">{label}</p>
      <div className="max-w-xs">{children}</div>
    </div>
  );
}

function InputDemo({ initial, label }) {
  const [v, setV] = useState(initial);
  return <Input label={label} value={v} onChange={setV} />;
}

function FilterChipsDemo({ withCounts }) {
  const [v, setV] = useState('todas');
  return (
    <FilterChips
      value={v}
      onChange={setV}
      options={[
        { value: 'todas', label: 'Todas', count: withCounts ? 12 : null },
        { value: 'aberta', label: 'Abertas', count: withCounts ? 4 : null },
        { value: 'finalizada', label: 'Finalizadas', count: withCounts ? 7 : null },
        { value: 'cancelada', label: 'Canceladas', count: withCounts ? 1 : null },
      ]}
    />
  );
}

function SheetItemDemo({ icon, label, destructive }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-3 rounded-xl ${destructive ? 'text-red-600' : 'text-slate-900'}`}>
      <Icon name={icon} className="w-5 h-5" />
      <span className="font-semibold text-sm">{label}</span>
    </div>
  );
}

function TabItem({ icon, label, active }) {
  return (
    <div className={`flex-1 flex flex-col items-center justify-center gap-0.5 ${active ? 'text-blue-600' : 'text-slate-400'}`}>
      <Icon name={icon} className="w-5 h-5" />
      <span className="text-[10px] font-semibold">{label}</span>
    </div>
  );
}

Object.assign(window, { ComponentsGallery });
