// Remaining prototype screens — split into its own file to keep prototype.jsx manageable

// ============================
// Create / Edit Note
// ============================
function CreateNoteScreen({ pop, push, popTo, draftNote, setDraftNote, notas, setNotas, proximoNumero, setProximoNumero, showToast, params }) {
  const isEdit = params.mode === 'edit';
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (!draftNote) {
    // Recovery — shouldn't happen in normal flow
    return <EmptyState title="Nenhum rascunho ativo" description="Volte e crie uma nova nota." />;
  }

  const setField = (k, v) => setDraftNote(d => ({ ...d, [k]: v }));
  const removeItem = (id) => {
    setDraftNote(d => {
      const itens = d.itens.filter(i => i.id !== id);
      return { ...d, itens, total: itens.reduce((s,i)=>s+i.subtotal,0) };
    });
  };

  const validate = () => {
    const e = {};
    if (!draftNote.clienteNome?.trim()) e.clienteNome = 'Informe o nome do cliente';
    if (draftNote.itens.length === 0) e.itens = 'Adicione ao menos um item';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const commitNote = (status) => {
    if (!validate()) {
      showToast('Verifique os campos obrigatórios', 'error');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const now = new Date().toISOString();
      const final = {
        ...draftNote,
        status,
        criadaEm: draftNote.criadaEm || now,
        ...(status === 'finalizada' ? { finalizadaEm: now } : {}),
      };
      if (isEdit) {
        setNotas(ns => ns.map(n => n.id === final.id ? final : n));
      } else {
        setNotas(ns => [final, ...ns]);
        setProximoNumero(n => n + 1);
      }
      setDraftNote(null);
      setSaving(false);
      showToast(status === 'finalizada' ? 'Nota finalizada' : 'Nota salva');
      if (status === 'finalizada') {
        // Replace with detail
        popTo('notes-list');
        setTimeout(() => push({ name: 'note-details', params: { id: final.id } }), 50);
      } else {
        popTo('notes-list');
      }
    }, 500);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4">
        <ScreenHeader
          title={isEdit ? `Editar nota #${draftNote.numero}` : 'Nova nota'}
          subtitle={isEdit ? 'Atualize os dados da nota' : `Nota #${draftNote.numero}`}
          onBack={() => {
            if (draftNote.itens.length > 0 || draftNote.clienteNome) {
              setConfirmCancel(true);
            } else {
              setDraftNote(null);
              pop();
            }
          }}
        />
      </div>

      <div className="flex-1 overflow-y-auto nice-scroll px-4 pb-6 space-y-4">
        {/* Cliente */}
        <Card>
          <p className="wf-annotation mb-3">Dados do cliente</p>
          <div className="space-y-3">
            <Input
              label="Nome do cliente *"
              value={draftNote.clienteNome}
              onChange={v => setField('clienteNome', v)}
              placeholder="Nome completo"
              error={errors.clienteNome}
              autoFocus={!isEdit}
            />
            <Input
              label="Telefone"
              value={draftNote.clienteTelefone}
              onChange={v => setField('clienteTelefone', v)}
              placeholder="(00) 00000-0000"
            />
            <TextArea
              label="Observação"
              value={draftNote.observacao}
              onChange={v => setField('observacao', v)}
              placeholder="Detalhes, instruções, prazo..."
              rows={2}
            />
          </div>
        </Card>

        {/* Itens */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <p className="wf-annotation">Itens ({draftNote.itens.length})</p>
            <button
              onClick={() => push({ name: 'add-note-item' })}
              className="text-xs font-bold text-blue-600 active:opacity-70"
            >
              + Adicionar
            </button>
          </div>
          {draftNote.itens.length === 0 ? (
            <div className={`rounded-xl border-2 border-dashed p-5 text-center ${errors.itens ? 'border-red-300' : 'border-slate-200'}`}>
              <p className="text-sm text-slate-500">Nenhum item adicionado</p>
              <button
                onClick={() => push({ name: 'add-note-item' })}
                className="mt-2 text-xs font-bold text-blue-600"
              >
                Selecionar serviço
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {draftNote.itens.map(item => (
                <div key={item.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 truncate">{item.nome}</p>
                    <p className="text-xs text-slate-500">{item.quantidade} × {fmtBRL(item.precoUnitario)}</p>
                  </div>
                  <p className="font-bold text-sm text-slate-900">{fmtBRL(item.subtotal)}</p>
                  <button onClick={() => removeItem(item.id)} className="w-8 h-8 rounded-lg text-slate-400 active:bg-slate-200 flex items-center justify-center">
                    <Icon name="trash" className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {errors.itens && <p className="mt-2 text-xs font-medium text-red-600">{errors.itens}</p>}
        </Card>

        {/* Total */}
        {draftNote.itens.length > 0 && (
          <div className="rounded-2xl bg-blue-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Total</p>
              <p className="text-2xl font-bold tracking-tight">{fmtBRL(draftNote.total)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white px-4 py-3 grid grid-cols-2 gap-2.5">
        <Button variant="secondary" onClick={() => commitNote('aberta')} loading={saving}>
          Salvar aberta
        </Button>
        <Button variant="primary" onClick={() => commitNote('finalizada')} loading={saving}>
          Finalizar
        </Button>
      </div>

      <ConfirmDialog
        open={confirmCancel}
        title="Descartar nota?"
        description="As alterações não serão salvas."
        confirmLabel="Descartar"
        destructive
        onConfirm={() => { setDraftNote(null); setConfirmCancel(false); pop(); }}
        onCancel={() => setConfirmCancel(false)}
      />
    </div>
  );
}

// ============================
// Add Note Item — select servico + qty
// ============================
function AddNoteItemScreen({ pop, servicos, draftNote, setDraftNote, showToast }) {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [qty, setQty] = useState(1);

  const ativos = servicos.filter(s => s.status === 'ativo');
  const filtered = search
    ? ativos.filter(s => s.nome.toLowerCase().includes(search.toLowerCase()))
    : ativos;

  const selected = servicos.find(s => s.id === selectedId);

  const addToNote = () => {
    if (!selected || !draftNote) return;
    const item = {
      id: 'i-' + Date.now(),
      servicoId: selected.id,
      nome: selected.nome,
      quantidade: qty,
      precoUnitario: selected.preco,
      subtotal: selected.preco * qty,
    };
    setDraftNote(d => {
      const itens = [...d.itens, item];
      return { ...d, itens, total: itens.reduce((s,i)=>s+i.subtotal,0) };
    });
    showToast(`${selected.nome} adicionado`);
    pop();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4">
        <ScreenHeader
          title="Adicionar item"
          subtitle="Selecione um serviço"
          onBack={pop}
        />
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar serviço" />
      </div>

      <div className="flex-1 overflow-y-auto nice-scroll px-4 pt-3 pb-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon="search"
            title="Nenhum serviço encontrado"
            description={search ? `Não há serviços com "${search}"` : 'Cadastre serviços antes de criar notas.'}
          />
        ) : (
          <div className="space-y-2.5">
            {filtered.map(s => (
              <Card
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                selected={selectedId === s.id}
                className="p-3.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 truncate">{s.nome}</p>
                    {s.descricao && <p className="text-xs text-slate-500 truncate mt-0.5">{s.descricao}</p>}
                  </div>
                  <Money value={s.preco} size="sm" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quantity + Add */}
      {selected && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 fade-in">
          <div className="rounded-xl bg-slate-50 p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Selecionado</p>
                <p className="font-semibold text-sm text-slate-900 truncate">{selected.nome}</p>
              </div>
              <p className="text-xs text-slate-500">{fmtBRL(selected.preco)} / un</p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-700">Quantidade</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center active:bg-slate-50"
                >
                  <Icon name="minus" className="w-4 h-4" />
                </button>
                <span className="text-xl font-bold w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center active:scale-95"
                >
                  <Icon name="plus" className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Subtotal</span>
              <Money value={selected.preco * qty} />
            </div>
          </div>
          <Button variant="primary" fullWidth onClick={addToNote}>
            Adicionar à nota
          </Button>
        </div>
      )}
    </div>
  );
}

// ============================
// Note Details
// ============================
function NoteDetailsScreen({ params, notas, setNotas, pop, push, setDraftNote, showToast }) {
  const nota = notas.find(n => n.id === params.id);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmFinalize, setConfirmFinalize] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (!nota) return <EmptyState title="Nota não encontrada" />;

  const update = (patch) => setNotas(ns => ns.map(n => n.id === nota.id ? { ...n, ...patch } : n));

  return (
    <div className="h-full flex flex-col">
      <div className="px-4">
        <ScreenHeader
          title={nota.clienteNome}
          subtitle={`Nota #${nota.numero}`}
          onBack={pop}
          right={(
            <button onClick={() => setSheetOpen(true)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center active:bg-slate-50">
              <Icon name="menu-dot" className="w-4 h-4" />
            </button>
          )}
        />
      </div>

      <div className="flex-1 overflow-y-auto nice-scroll px-4 space-y-4 pb-4">
        {/* Status card */}
        <Card>
          <div className="flex items-center justify-between">
            <Badge status={nota.status} />
            <span className="text-xs text-slate-500">{fmtDate(nota.criadaEm)}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-400">Telefone</p>
              <p className="text-sm font-semibold mt-0.5">{nota.clienteTelefone || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-400">Itens</p>
              <p className="text-sm font-semibold mt-0.5">{nota.itens.length}</p>
            </div>
          </div>
          {nota.observacao && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-[10px] font-semibold uppercase text-slate-400 mb-1">Observação</p>
              <p className="text-sm text-slate-700">{nota.observacao}</p>
            </div>
          )}
        </Card>

        {/* Items */}
        <Card>
          <p className="wf-annotation mb-3">Itens</p>
          <div className="space-y-3">
            {nota.itens.map((item, idx) => (
              <div key={item.id} className={`flex items-center justify-between ${idx < nota.itens.length - 1 ? 'pb-3 border-b border-slate-100' : ''}`}>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-slate-900 truncate">{item.nome}</p>
                  <p className="text-xs text-slate-500">{item.quantidade} × {fmtBRL(item.precoUnitario)}</p>
                </div>
                <p className="font-bold text-sm">{fmtBRL(item.subtotal)}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Total */}
        <div className="rounded-2xl bg-blue-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80">Total</p>
              <p className="text-[11px] opacity-70">{nota.itens.length} {nota.itens.length === 1 ? 'item' : 'itens'}</p>
            </div>
            <p className="text-3xl font-bold tracking-tight">{fmtBRL(nota.total)}</p>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="border-t border-slate-200 bg-white px-4 py-3 space-y-2">
        <div className="grid grid-cols-2 gap-2.5">
          <Button variant="secondary" onClick={() => push({ name: 'pdf-preview', params: { id: nota.id } })} icon={<Icon name="pdf" className="w-4 h-4" />}>
            Gerar PDF
          </Button>
          {nota.status === 'aberta' ? (
            <Button variant="primary" onClick={() => setConfirmFinalize(true)} icon={<Icon name="check" className="w-4 h-4" />}>
              Finalizar
            </Button>
          ) : (
            <Button variant="primary" onClick={() => showToast('PDF compartilhado')} icon={<Icon name="share" className="w-4 h-4" />}>
              Compartilhar
            </Button>
          )}
        </div>
      </div>

      {/* Action sheet */}
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Ações da nota">
        <div className="space-y-1 -mx-2">
          {nota.status === 'aberta' && (
            <SheetItem icon="edit" label="Editar nota" onClick={() => {
              setDraftNote({ ...nota });
              setSheetOpen(false);
              push({ name: 'create-note', params: { mode: 'edit' } });
            }} />
          )}
          <SheetItem icon="share" label="Compartilhar PDF" onClick={() => { setSheetOpen(false); showToast('PDF compartilhado'); }} />
          <SheetItem icon="download" label="Baixar PDF" onClick={() => { setSheetOpen(false); showToast('PDF salvo'); }} />
          {nota.status !== 'cancelada' && (
            <SheetItem icon="trash" label="Cancelar nota" destructive onClick={() => { setSheetOpen(false); setConfirmCancel(true); }} />
          )}
        </div>
      </BottomSheet>

      <ConfirmDialog
        open={confirmFinalize}
        title="Finalizar nota?"
        description="Após finalizar, a nota será marcada como concluída e ficará disponível para compartilhamento."
        confirmLabel="Finalizar"
        onConfirm={() => {
          update({ status: 'finalizada', finalizadaEm: new Date().toISOString() });
          setConfirmFinalize(false);
          showToast('Nota finalizada');
        }}
        onCancel={() => setConfirmFinalize(false)}
      />
      <ConfirmDialog
        open={confirmCancel}
        title="Cancelar esta nota?"
        description="A nota será marcada como cancelada. Essa ação não pode ser desfeita."
        confirmLabel="Cancelar nota"
        cancelLabel="Voltar"
        destructive
        onConfirm={() => {
          update({ status: 'cancelada', canceladaEm: new Date().toISOString() });
          setConfirmCancel(false);
          showToast('Nota cancelada', 'info');
        }}
        onCancel={() => setConfirmCancel(false)}
      />
    </div>
  );
}

function SheetItem({ icon, label, onClick, destructive }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl active:bg-slate-100 transition-colors ${destructive ? 'text-red-600' : 'text-slate-900'}`}
    >
      <Icon name={icon} className="w-5 h-5" />
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );
}

// ============================
// PDF Preview
// ============================
function PdfPreviewScreen({ params, notas, pop, showToast }) {
  const nota = notas.find(n => n.id === params.id);
  if (!nota) return <EmptyState title="Nota não encontrada" />;

  return (
    <div className="h-full flex flex-col">
      <div className="px-4">
        <ScreenHeader title="Prévia do PDF" subtitle={`Nota #${nota.numero}`} onBack={pop} />
      </div>
      <div className="flex-1 overflow-y-auto nice-scroll px-4 pb-4">
        {/* PDF mock */}
        <div className="rounded-xl bg-white border border-slate-300 shadow-md overflow-hidden">
          <div className="bg-slate-900 text-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70">Recibo de serviço</p>
            <p className="font-bold text-lg mt-1">{empresa.nome}</p>
            <p className="text-xs opacity-80">{empresa.telefone}</p>
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Nota</span>
              <span className="font-bold mono">#{nota.numero}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Data</span>
              <span className="font-semibold">{new Date(nota.criadaEm).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cliente</span>
              <span className="font-semibold">{nota.clienteNome}</span>
            </div>
            {nota.clienteTelefone && (
              <div className="flex justify-between">
                <span className="text-slate-500">Telefone</span>
                <span className="font-semibold">{nota.clienteTelefone}</span>
              </div>
            )}

            <div className="border-t border-dashed border-slate-300 my-3"></div>

            <div className="space-y-2">
              {nota.itens.map(item => (
                <div key={item.id} className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{item.nome}</p>
                    <p className="text-xs text-slate-500">{item.quantidade} × {fmtBRL(item.precoUnitario)}</p>
                  </div>
                  <p className="font-semibold">{fmtBRL(item.subtotal)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-slate-300 my-3"></div>

            <div className="flex justify-between items-baseline">
              <span className="text-base font-bold">TOTAL</span>
              <span className="text-2xl font-bold text-blue-600">{fmtBRL(nota.total)}</span>
            </div>

            {nota.observacao && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-[10px] font-semibold uppercase text-slate-400">Observação</p>
                <p className="text-xs text-slate-600 mt-1">{nota.observacao}</p>
              </div>
            )}

            <p className="text-center text-[10px] text-slate-400 pt-3">Gerado em {new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-white px-4 py-3 grid grid-cols-2 gap-2.5">
        <Button variant="secondary" onClick={() => showToast('PDF baixado')} icon={<Icon name="download" className="w-4 h-4" />}>Baixar</Button>
        <Button variant="primary" onClick={() => showToast('PDF compartilhado')} icon={<Icon name="share" className="w-4 h-4" />}>Compartilhar</Button>
      </div>
    </div>
  );
}

// ============================
// Services List
// ============================
function ServicesListScreen({ servicos, push }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ativo');

  const filtered = useMemo(() => {
    let list = servicos.filter(s => s.status === filter);
    if (search) list = list.filter(s => s.nome.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [servicos, filter, search]);

  return (
    <div className="h-full flex flex-col">
      <div className="px-4">
        <div className="flex items-center justify-between pt-2 pb-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Serviços</h2>
            <p className="text-xs text-slate-500">Catálogo de preços</p>
          </div>
          <button
            onClick={() => push({ name: 'service-form', params: { mode: 'create' } })}
            className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center active:scale-95"
          >
            <Icon name="plus" className="w-5 h-5" />
          </button>
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar serviço" />
        <div className="mt-3">
          <FilterChips
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'ativo', label: 'Ativos', count: servicos.filter(s => s.status === 'ativo').length },
              { value: 'inativo', label: 'Inativos', count: servicos.filter(s => s.status === 'inativo').length },
            ]}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto nice-scroll px-4 pt-3 pb-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon="tag"
            title="Sem serviços"
            description={filter === 'ativo' ? 'Cadastre serviços para usar nas notas.' : 'Nenhum serviço inativo.'}
            action={filter === 'ativo' ? 'Novo serviço' : undefined}
            onAction={() => push({ name: 'service-form', params: { mode: 'create' } })}
          />
        ) : (
          <div className="space-y-2.5">
            {filtered.map(s => (
              <Card key={s.id} onClick={() => push({ name: 'service-form', params: { mode: 'edit', id: s.id } })} className="p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 truncate">{s.nome}</p>
                    {s.descricao && <p className="text-xs text-slate-500 truncate mt-0.5">{s.descricao}</p>}
                  </div>
                  <Badge status={s.status} />
                </div>
                <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <Money value={s.preco} />
                  <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                    Editar <Icon name="chevron-right" className="w-3 h-3" />
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================
// Service form (create / edit)
// ============================
function ServiceFormScreen({ params, servicos, setServicos, pop, showToast }) {
  const isEdit = params.mode === 'edit';
  const existing = isEdit ? servicos.find(s => s.id === params.id) : null;
  const [form, setForm] = useState({
    nome: existing?.nome || '',
    descricao: existing?.descricao || '',
    preco: existing?.preco ? String(existing.preco) : '',
    ativo: existing ? existing.status === 'ativo' : true,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const save = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Informe o nome do serviço';
    const preco = parseFloat(form.preco.replace(',', '.'));
    if (!form.preco || isNaN(preco) || preco <= 0) e.preco = 'Informe um preço válido';
    setErrors(e);
    if (Object.keys(e).length) return;

    setSaving(true);
    setTimeout(() => {
      if (isEdit) {
        setServicos(arr => arr.map(s => s.id === existing.id ? {
          ...s, nome: form.nome.trim(), descricao: form.descricao.trim(), preco, status: form.ativo ? 'ativo' : 'inativo'
        } : s));
        showToast('Serviço atualizado');
      } else {
        setServicos(arr => [{
          id: 's-' + Date.now(),
          nome: form.nome.trim(),
          descricao: form.descricao.trim(),
          preco,
          status: form.ativo ? 'ativo' : 'inativo',
        }, ...arr]);
        showToast('Serviço criado');
      }
      setSaving(false);
      pop();
    }, 400);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4">
        <ScreenHeader
          title={isEdit ? 'Editar serviço' : 'Novo serviço'}
          subtitle={isEdit ? existing?.nome : 'Cadastro de item do catálogo'}
          onBack={pop}
        />
      </div>
      <div className="flex-1 overflow-y-auto nice-scroll px-4 pb-4 space-y-3">
        <Card>
          <div className="space-y-3">
            <Input
              label="Nome *"
              value={form.nome}
              onChange={v => setForm(f => ({ ...f, nome: v }))}
              placeholder="Ex: Aplicação de porcelana"
              error={errors.nome}
              autoFocus
            />
            <TextArea
              label="Descrição"
              value={form.descricao}
              onChange={v => setForm(f => ({ ...f, descricao: v }))}
              placeholder="Detalhes do serviço (opcional)"
              rows={2}
            />
            <Input
              label="Preço *"
              value={form.preco}
              onChange={v => setForm(f => ({ ...f, preco: v }))}
              placeholder="0,00"
              prefix="R$"
              error={errors.preco}
            />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-slate-900">Status ativo</p>
              <p className="text-xs text-slate-500">Disponível para novas notas</p>
            </div>
            <Toggle value={form.ativo} onChange={v => setForm(f => ({ ...f, ativo: v }))} />
          </div>
        </Card>
        {isEdit && (
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-full h-12 rounded-xl text-sm font-bold text-red-600 active:bg-red-50 transition-colors"
          >
            Excluir serviço
          </button>
        )}
      </div>
      <div className="border-t border-slate-200 bg-white px-4 py-3 grid grid-cols-2 gap-2.5">
        <Button variant="secondary" onClick={pop}>Cancelar</Button>
        <Button variant="primary" onClick={save} loading={saving}>Salvar</Button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Excluir serviço?"
        description="O serviço será removido permanentemente do catálogo."
        confirmLabel="Excluir"
        destructive
        onConfirm={() => {
          setServicos(arr => arr.filter(s => s.id !== existing.id));
          showToast('Serviço excluído', 'info');
          setConfirmDelete(false);
          pop();
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-12 h-7 rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-slate-300'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : ''}`}></span>
    </button>
  );
}

// ============================
// Clients List
// ============================
function ClientsListScreen({ clientes, notas, push, pop }) {
  const [search, setSearch] = useState('');

  const enriched = useMemo(() => {
    return clientes.map(c => {
      const notasCli = notas.filter(n => n.clienteId === c.id && n.status !== 'cancelada');
      const total = notasCli.reduce((s, n) => s + n.total, 0);
      const ultima = notasCli.sort((a,b)=> (b.criadaEm||'').localeCompare(a.criadaEm||''))[0];
      return { ...c, totalGasto: total, totalNotas: notasCli.length, ultima };
    }).filter(c => !search || c.nome.toLowerCase().includes(search.toLowerCase()));
  }, [clientes, notas, search]);

  return (
    <div className="h-full flex flex-col">
      <div className="px-4">
        <ScreenHeader title="Clientes" subtitle="Histórico por cliente" onBack={pop} />
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar cliente" />
      </div>
      <div className="flex-1 overflow-y-auto nice-scroll px-4 pt-3 pb-4">
        {enriched.length === 0 ? (
          <EmptyState icon="users" title="Sem clientes" description="Os clientes são criados automaticamente ao registrar notas." />
        ) : (
          <div className="space-y-2.5">
            {enriched.map(c => (
              <Card key={c.id} onClick={() => push({ name: 'client-details', params: { id: c.id } })} className="p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 truncate">{c.nome}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {c.totalNotas} {c.totalNotas === 1 ? 'nota' : 'notas'}
                      {c.ultima ? ` · Última ${fmtDate(c.ultima.criadaEm)}` : ''}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <Money value={c.totalGasto} size="sm" />
                    <p className="text-[10px] text-slate-400 mt-0.5">Total</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================
// Client Details
// ============================
function ClientDetailsScreen({ params, clientes, notas, push, pop, switchTab, setDraftNote, proximoNumero }) {
  const cli = clientes.find(c => c.id === params.id);
  if (!cli) return <EmptyState title="Cliente não encontrado" />;

  const notasCli = notas.filter(n => n.clienteId === cli.id).sort((a,b)=>(b.criadaEm||'').localeCompare(a.criadaEm||''));
  const totalAcumulado = notasCli.filter(n => n.status !== 'cancelada').reduce((s,n)=>s+n.total,0);

  const startNewNote = () => {
    setDraftNote({
      id: 'draft-' + Date.now(),
      numero: String(proximoNumero).padStart(4, '0'),
      clienteId: cli.id,
      clienteNome: cli.nome,
      clienteTelefone: cli.telefone,
      observacao: '',
      itens: [],
      total: 0,
      status: 'rascunho',
    });
    switchTab(TAB_NOTAS);
    // Push create-note via internal nav after switch
    setTimeout(() => push({ name: 'create-note', params: { mode: 'create' } }), 50);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4">
        <ScreenHeader title={cli.nome} subtitle={cli.telefone} onBack={pop} />
      </div>
      <div className="flex-1 overflow-y-auto nice-scroll px-4 space-y-4 pb-4">
        <Card>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-400">Total acumulado</p>
              <Money value={totalAcumulado} className="mt-1" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-400">Notas</p>
              <p className="text-lg font-bold mt-1">{notasCli.length}</p>
            </div>
          </div>
        </Card>

        <div>
          <p className="wf-annotation mb-2.5 px-1">Histórico</p>
          {notasCli.length === 0 ? (
            <EmptyState icon="inbox" title="Nenhuma nota ainda" />
          ) : (
            <div className="space-y-2.5">
              {notasCli.map(n => (
                <NotaCard key={n.id} nota={n} onClick={() => push({ name: 'note-details', params: { id: n.id } })} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-slate-200 bg-white px-4 py-3">
        <Button variant="primary" fullWidth icon={<Icon name="plus" className="w-4 h-4" />} onClick={startNewNote}>
          Nova nota para {cli.nome.split(' ')[0]}
        </Button>
      </div>
    </div>
  );
}

// ============================
// Reports
// ============================
function ReportsScreen({ notas, pop, showToast }) {
  const [period, setPeriod] = useState('mes');

  const ativos = notas.filter(n => n.status !== 'cancelada');
  const total = ativos.reduce((s, n) => s + n.total, 0);
  const abertas = notas.filter(n => n.status === 'aberta');
  const finalizadas = notas.filter(n => n.status === 'finalizada');
  const canceladas = notas.filter(n => n.status === 'cancelada');

  const totalNotas = notas.length || 1;
  const pctFinalizadas = Math.round(finalizadas.length / totalNotas * 100);
  const pctAbertas = Math.round(abertas.length / totalNotas * 100);
  const pctCanceladas = Math.round(canceladas.length / totalNotas * 100);

  // Top servicos
  const servicoCount = {};
  ativos.forEach(n => n.itens.forEach(i => {
    servicoCount[i.nome] = (servicoCount[i.nome] || 0) + i.quantidade;
  }));
  const topServicos = Object.entries(servicoCount).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const maxCount = topServicos[0]?.[1] || 1;

  return (
    <div className="h-full flex flex-col">
      <div className="px-4">
        <ScreenHeader title="Relatórios" subtitle="Resumo do negócio" onBack={pop} />
        <FilterChips
          value={period}
          onChange={setPeriod}
          options={[
            { value: 'hoje', label: 'Hoje' },
            { value: 'semana', label: 'Semana' },
            { value: 'mes', label: 'Mês' },
            { value: 'ano', label: 'Ano' },
          ]}
        />
      </div>

      <div className="flex-1 overflow-y-auto nice-scroll px-4 pt-3 pb-4 space-y-3">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-4 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Faturamento do mês</p>
          <p className="mt-1.5 text-3xl font-bold tracking-tight">{fmtBRL(total)}</p>
          <p className="mt-1 text-xs opacity-80">{ativos.length} notas ativas</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Card className="p-3">
            <p className="text-[10px] font-semibold uppercase text-slate-400">Abertas</p>
            <p className="mt-1.5 text-lg font-bold text-amber-600">{abertas.length}</p>
          </Card>
          <Card className="p-3">
            <p className="text-[10px] font-semibold uppercase text-slate-400">Final.</p>
            <p className="mt-1.5 text-lg font-bold text-green-600">{finalizadas.length}</p>
          </Card>
          <Card className="p-3">
            <p className="text-[10px] font-semibold uppercase text-slate-400">Cancel.</p>
            <p className="mt-1.5 text-lg font-bold text-red-600">{canceladas.length}</p>
          </Card>
        </div>

        <Card>
          <p className="wf-annotation mb-3">Por status</p>
          <div className="space-y-3">
            {[
              { label: 'Finalizadas', pct: pctFinalizadas, color: 'bg-green-500' },
              { label: 'Abertas', pct: pctAbertas, color: 'bg-amber-500' },
              { label: 'Canceladas', pct: pctCanceladas, color: 'bg-red-500' },
            ].map(row => (
              <div key={row.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">{row.label}</span>
                  <span className="font-bold">{row.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${row.color} rounded-full transition-all`} style={{ width: `${row.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="wf-annotation mb-3">Serviços mais vendidos</p>
          <div className="space-y-2.5">
            {topServicos.map(([nome, count]) => (
              <div key={nome}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 truncate">{nome}</span>
                  <span className="font-bold">{count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${count/maxCount*100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="border-t border-slate-200 bg-white px-4 py-3">
        <Button variant="primary" fullWidth icon={<Icon name="download" className="w-4 h-4" />} onClick={() => showToast('Relatório PDF gerado')}>
          Exportar relatório em PDF
        </Button>
      </div>
    </div>
  );
}

// ============================
// Settings
// ============================
function SettingsScreen({ showToast }) {
  const [confirmClear, setConfirmClear] = useState(false);

  const sections = [
    {
      title: 'Empresa',
      items: [
        { icon: 'building', label: 'Dados da empresa', sub: empresa.nome },
        { icon: 'logo', label: 'Logo', sub: 'Aparece no PDF' },
        { icon: 'phone', label: 'Telefone', sub: empresa.telefone },
      ],
    },
    {
      title: 'Notas',
      items: [
        { icon: 'doc-text', label: 'Numeração das notas', sub: `Próxima: #${empresa.proximaNota}` },
        { icon: 'pdf', label: 'Modelo do PDF', sub: 'Cabeçalho, rodapé, observações' },
      ],
    },
    {
      title: 'Dados',
      items: [
        { icon: 'backup', label: 'Backup / exportar', sub: 'Exportar tudo (.json)' },
      ],
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 pt-2 pb-3">
        <h2 className="text-2xl font-bold text-slate-950">Ajustes</h2>
        <p className="text-xs text-slate-500">Configurações do app</p>
      </div>
      <div className="flex-1 overflow-y-auto nice-scroll px-4 pb-4 space-y-4">
        {sections.map(sec => (
          <div key={sec.title}>
            <p className="wf-annotation mb-2 px-1">{sec.title}</p>
            <Card className="!p-0 overflow-hidden">
              {sec.items.map((it, idx) => (
                <button
                  key={it.label}
                  onClick={() => showToast(`Abrir ${it.label.toLowerCase()}`, 'info')}
                  className={`w-full flex items-center gap-3 p-3.5 active:bg-slate-50 ${idx < sec.items.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Icon name={it.icon} className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-sm text-slate-900">{it.label}</p>
                    <p className="text-xs text-slate-500 truncate">{it.sub}</p>
                  </div>
                  <Icon name="chevron-right" className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              ))}
            </Card>
          </div>
        ))}

        <button
          onClick={() => setConfirmClear(true)}
          className="w-full h-12 rounded-xl border border-red-200 text-sm font-bold text-red-600 active:bg-red-50 transition-colors"
        >
          Limpar dados locais
        </button>

        <p className="text-center text-[10px] text-slate-400 pt-2">v1.0.0 · React Native + Expo</p>
      </div>

      <ConfirmDialog
        open={confirmClear}
        title="Limpar todos os dados?"
        description="Esta ação remove todas as notas, clientes e serviços do dispositivo. Não pode ser desfeita."
        confirmLabel="Limpar tudo"
        destructive
        onConfirm={() => {
          setConfirmClear(false);
          showToast('Dados limpos', 'info');
        }}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  );
}

Object.assign(window, {
  CreateNoteScreen, AddNoteItemScreen, NoteDetailsScreen, PdfPreviewScreen,
  ServicesListScreen, ServiceFormScreen, ClientsListScreen, ClientDetailsScreen,
  ReportsScreen, SettingsScreen,
});
