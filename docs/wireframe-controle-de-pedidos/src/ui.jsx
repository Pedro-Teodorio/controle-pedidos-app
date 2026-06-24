// Base UI primitives shared across prototype and components gallery
const { useState, useEffect, useRef, useMemo, useCallback } = React;

function Badge({ status, children, className = '' }) {
  const cls = statusStyle[status] || 'bg-slate-100 text-slate-700';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${cls} ${className}`}>
      {children || statusLabel[status] || status}
    </span>
  );
}

function Button({ children, variant = 'primary', size = 'md', loading, disabled, onClick, className = '', icon, fullWidth }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'h-9 px-3 text-xs', md: 'h-12 px-5 text-sm', lg: 'h-14 px-6 text-base' };
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20',
    secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-blue-600 hover:bg-blue-50',
    danger_ghost: 'text-red-600 hover:bg-red-50',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <span className="flex gap-1">
          <span className="loader-dot inline-block w-1.5 h-1.5 rounded-full bg-current"></span>
          <span className="loader-dot inline-block w-1.5 h-1.5 rounded-full bg-current"></span>
          <span className="loader-dot inline-block w-1.5 h-1.5 rounded-full bg-current"></span>
        </span>
      ) : (
        <>
          {icon && <span className="text-base leading-none">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}

function Input({ value, onChange, placeholder, error, disabled, type = 'text', prefix, suffix, label, hint, autoFocus }) {
  const [focused, setFocused] = useState(false);
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</span>}
      <div className={`flex items-center h-12 rounded-xl border bg-white px-3 transition-colors
        ${error ? 'border-red-400' : focused ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}
        ${disabled ? 'opacity-60 bg-slate-50' : ''}`}>
        {prefix && <span className="text-sm text-slate-500 mr-2">{prefix}</span>}
        <input
          type={type}
          value={value || ''}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-slate-400"
        />
        {suffix && <span className="text-sm text-slate-500 ml-2">{suffix}</span>}
      </div>
      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      ) : null}
    </label>
  );
}

function TextArea({ value, onChange, placeholder, label, error, rows = 3 }) {
  const [focused, setFocused] = useState(false);
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</span>}
      <textarea
        value={value || ''}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full rounded-xl border bg-white px-3 py-3 outline-none text-[15px] placeholder:text-slate-400 transition-colors resize-none
          ${error ? 'border-red-400' : focused ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}
      />
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </label>
  );
}

function Card({ children, className = '', onClick, selected, disabled }) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`rounded-2xl border bg-white p-4 shadow-sm transition-all
        ${selected ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'}
        ${onClick && !disabled ? 'tap-target active:bg-slate-50' : ''}
        ${disabled ? 'opacity-50' : ''}
        ${className}`}
    >
      {children}
    </div>
  );
}

function Money({ value, size = 'md', className = '' }) {
  const sizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl', xl: 'text-3xl' };
  return <span className={`font-bold text-blue-600 ${sizes[size]} ${className}`}>{fmtBRL(value)}</span>;
}

function SearchInput({ value, onChange, placeholder = 'Buscar...' }) {
  return (
    <div className="flex items-center h-11 rounded-xl border border-slate-200 bg-white px-3.5">
      <Icon name="search" className="w-4 h-4 text-slate-400 mr-2" />
      <input
        value={value || ''}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-slate-400"
      />
      {value && (
        <button onClick={() => onChange?.('')} className="ml-2 text-slate-400 active:text-slate-600">
          <Icon name="x" className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function FilterChips({ options, value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto nice-scroll -mx-1 px-1 pb-1">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors
            ${value === opt.value
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 active:bg-slate-50'}`}
        >
          {opt.label}{opt.count != null && <span className="ml-1.5 opacity-70">{opt.count}</span>}
        </button>
      ))}
    </div>
  );
}

function EmptyState({ icon = 'inbox', title, description, action, onAction }) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-6">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
        <Icon name={icon} className="w-7 h-7" />
      </div>
      <p className="mt-4 font-bold text-slate-900">{title}</p>
      {description && <p className="mt-1 text-sm text-slate-500 max-w-[240px]">{description}</p>}
      {action && (
        <Button onClick={onAction} className="mt-5" size="sm">{action}</Button>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3 py-2 fade-in">
      {[0,1,2].map(i => (
        <div key={i} className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
          <div className="h-3 w-24 rounded-full bg-slate-100 animate-pulse"></div>
          <div className="mt-3 h-4 w-40 rounded-full bg-slate-100 animate-pulse"></div>
          <div className="mt-3 flex justify-between">
            <div className="h-3 w-20 rounded-full bg-slate-100 animate-pulse"></div>
            <div className="h-5 w-16 rounded-full bg-slate-100 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ title = 'Algo deu errado', description = 'Verifique a conexão ou tente novamente.', onRetry }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 fade-in">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <Icon name="alert" className="w-4 h-4 text-red-600" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-red-700">{title}</p>
          <p className="mt-0.5 text-sm text-red-700/80">{description}</p>
          {onRetry && (
            <button onClick={onRetry} className="mt-3 h-9 rounded-lg bg-red-600 text-white px-3 text-xs font-bold">
              Tentar novamente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose?.(), 2400);
    return () => clearTimeout(t);
  }, [message]);
  if (!message) return null;
  const bg = type === 'error' ? 'bg-red-600' : type === 'info' ? 'bg-slate-800' : 'bg-green-600';
  return (
    <div className="absolute bottom-20 left-3 right-3 z-50">
      <div className={`${bg} text-white rounded-xl px-4 py-3 text-sm font-semibold shadow-lg fade-in flex items-center gap-2`}>
        <Icon name={type === 'error' ? 'alert' : type === 'info' ? 'info' : 'check'} className="w-4 h-4" />
        {message}
      </div>
    </div>
  );
}

function ConfirmDialog({ open, title, description, confirmLabel = 'Confirmar', cancelLabel = 'Voltar', destructive, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40 flex items-end fade-in">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onCancel}></div>
      <div className="relative w-full bg-white rounded-t-3xl p-5 sheet-enter">
        <div className="mx-auto w-10 h-1 rounded-full bg-slate-200 mb-4"></div>
        <p className="font-bold text-slate-900 text-lg">{title}</p>
        {description && <p className="mt-1.5 text-sm text-slate-500">{description}</p>}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={destructive ? 'destructive' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40 flex items-end fade-in">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose}></div>
      <div className="relative w-full bg-white rounded-t-3xl sheet-enter max-h-[85%] flex flex-col">
        <div className="px-5 pt-4 pb-2">
          <div className="mx-auto w-10 h-1 rounded-full bg-slate-200 mb-3"></div>
          {title && <p className="font-bold text-slate-900">{title}</p>}
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-5 nice-scroll">{children}</div>
      </div>
    </div>
  );
}

function ScreenHeader({ title, subtitle, onBack, right }) {
  return (
    <div className="flex items-center gap-3 pt-3 pb-4">
      {onBack && (
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 active:bg-slate-50"
        >
          <Icon name="arrow-left" className="w-4 h-4" />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold text-slate-950 leading-tight truncate">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

// Icon set — small inline SVGs (stroke-based, minimal)
function Icon({ name, className = 'w-5 h-5' }) {
  const paths = {
    'home': <><path d="M3 11.5L12 4l9 7.5"/><path d="M5 10v10h14V10"/></>,
    'list': <><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></>,
    'plus': <><path d="M12 5v14M5 12h14"/></>,
    'minus': <><path d="M5 12h14"/></>,
    'tag': <><path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="7.5" cy="7.5" r="1"/></>,
    'settings': <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8L4.1 7a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
    'users': <><circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="7" r="2.5"/><path d="M21 18c0-2.2-1.8-4-4-4"/></>,
    'chart': <><path d="M3 20h18"/><rect x="6" y="10" width="3" height="7"/><rect x="11" y="6" width="3" height="11"/><rect x="16" y="13" width="3" height="4"/></>,
    'search': <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>,
    'x': <><path d="M18 6L6 18M6 6l12 12"/></>,
    'arrow-left': <><path d="M19 12H5M12 19l-7-7 7-7"/></>,
    'arrow-right': <><path d="M5 12h14M12 5l7 7-7 7"/></>,
    'chevron-right': <><path d="M9 6l6 6-6 6"/></>,
    'check': <><path d="M5 12l5 5L20 7"/></>,
    'alert': <><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 17v.01"/></>,
    'info': <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v.01"/></>,
    'inbox': <><path d="M3 13l3-8h12l3 8"/><path d="M3 13v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/><path d="M3 13h5l1 3h6l1-3h5"/></>,
    'pdf': <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9"/><path d="M14 3v6h6"/><path d="M9 13h6M9 17h4"/></>,
    'share': <><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8 11l8-4M8 13l8 4"/></>,
    'download': <><path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 20h16"/></>,
    'phone': <><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></>,
    'edit': <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></>,
    'trash': <><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></>,
    'calendar': <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
    'building': <><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01M10 21v-4h4v4"/></>,
    'logo': <><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12h8M8 8h8M8 16h5"/></>,
    'backup': <><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></>,
    'doc-text': <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M9 13h6M9 17h6"/></>,
    'sparkle': <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/></>,
    'menu-dot': <><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || null}
    </svg>
  );
}

Object.assign(window, {
  Badge, Button, Input, TextArea, Card, Money, SearchInput, FilterChips,
  EmptyState, LoadingState, ErrorState, Toast, ConfirmDialog, BottomSheet,
  ScreenHeader, Icon,
});
