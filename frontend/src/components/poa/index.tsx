import React from 'react';

// Helpers de formato
export const formatMoney = (v: number) => `$ ${v.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const formatPercent = (v: number) => `${Math.round(v)}%`;

const colors = {
  green: 'var(--verde-hoja, #3fa65b)',
  border: 'var(--borde, rgba(255,255,255,0.08))',
  text: 'var(--texto-claro, #e9edf3)',
  textSec: 'var(--texto-sec, #bfc7d1)',
  inputBg: '#0d213f',
};

// EstadoPill
export const EstadoPill: React.FC<{ estado: 'P' | 'I' | 'F'; text?: string; className?: string }>
  = ({ estado, text, className }) => {
    const map: Record<'P' | 'I' | 'F', { bg: string; bd: string; color: string; label: string }>
      = {
        P: { bg: 'rgba(169,50,38,.2)', bd: '#a93226', color: '#f7d5d0', label: 'Pendiente' },
        I: { bg: 'rgba(165,103,63,.2)', bd: '#a5673f', color: '#f7ddcc', label: 'En proceso' },
        F: { bg: 'rgba(46,204,113,.2)', bd: '#2ecc71', color: '#daf8e6', label: 'Finalizada' },
      };
    const s = map[estado];
    return (
      <span className={`estado-pill estado-${estado} ${className ?? ''}`}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '.1rem .5rem', borderRadius: 999, fontSize: '.72rem', fontWeight: 600, background: s.bg, border: `1px solid ${s.bd}`, color: s.color }}>
        {text ?? s.label}
      </span>
    );
};

// MesesGrid (12 checkboxes en tabla)
export const MesesGrid: React.FC<{ value: boolean[]; onChange: (index: number, checked: boolean) => void; className?: string }>
  = ({ value, onChange, className }) => {
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return (
      <table className={className} style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.75rem' }}>
        <thead>
          <tr>{months.map(m => <th key={m} style={{ color: colors.textSec, padding: '.2rem .25rem', textAlign: 'center' }}>{m}</th>)}</tr>
        </thead>
        <tbody>
          <tr>
            {value.map((v, i) => (
              <td key={i} style={{ padding: '.2rem .25rem', textAlign: 'center' }}>
                <input type="checkbox" checked={!!v} onChange={(e) => onChange(i, e.target.checked)} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
};

// KPIIndicatorRow (grid de campos KPI)
export interface KPIData { categoria: string; descripcion: string; meta: string; unidad: string; beneficiarios: string; }
export const KPIIndicatorRow: React.FC<{ value: KPIData; onChange: (data: KPIData) => void; className?: string }>
  = ({ value, onChange, className }) => {
    const set = (k: keyof KPIData, v: string) => onChange({ ...value, [k]: v });
    const inputStyle: React.CSSProperties = { width: '100%', marginTop: '.2rem', background: colors.inputBg, border: `1px solid ${colors.border}`, color: colors.text, padding: '.45rem .6rem', borderRadius: 6, fontSize: '.82rem' };
    return (
      <div className={className} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '.7rem' }}>
        <div>
          <label style={{ fontSize: '.72rem', marginBottom: '.1rem', display: 'block', color: colors.textSec }}>Indicador de logro (categoría)</label>
          <select value={value.categoria} onChange={(e) => set('categoria', e.target.value)} style={inputStyle}>
            <option value="">Seleccione...</option>
            <option>% de actividades ejecutadas</option>
            <option>Nº de personas beneficiadas directamente</option>
            <option>Nº de personas beneficiadas indirectamente</option>
            <option>Nº de productos / documentos generados</option>
            <option>Logro principal alcanzado (Sí/No)</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '.72rem', marginBottom: '.1rem', display: 'block', color: colors.textSec }}>Descripción específica</label>
          <input type="text" placeholder="Descripción del indicador de la actividad" value={value.descripcion} onChange={(e) => set('descripcion', e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '.72rem', marginBottom: '.1rem', display: 'block', color: colors.textSec }}>Meta</label>
          <input type="number" placeholder="Meta" value={value.meta} onChange={(e) => set('meta', e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '.72rem', marginBottom: '.1rem', display: 'block', color: colors.textSec }}>Unidad</label>
          <input type="text" placeholder="Unidad" value={value.unidad} onChange={(e) => set('unidad', e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '.72rem', marginBottom: '.1rem', display: 'block', color: colors.textSec }}>Beneficiarios</label>
          <input type="text" placeholder="Grupo beneficiado" value={value.beneficiarios} onChange={(e) => set('beneficiarios', e.target.value)} style={inputStyle} />
        </div>
      </div>
    );
};

// CostosTable
export interface CostRow { descripcion: string; qty: string; unidad: string; unit: string; }
export const CostosTable: React.FC<{
  rows: CostRow[];
  onRowChange: (index: number, row: CostRow) => void;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  title: string;
  addLabel: string;
  totalLabel: string;
  totalValue: number;
}> = ({ rows, onRowChange, onAddRow, onRemoveRow, title, addLabel, totalLabel, totalValue }) => {
  const rowTotal = (r: CostRow) => (parseFloat(r.qty) || 0) * (parseFloat(r.unit) || 0);
  const headCell = (w?: string) => ({ width: w });
  const inputStyle: React.CSSProperties = { width: '100%', marginTop: '.2rem', background: colors.inputBg, border: `1px solid ${colors.border}`, color: colors.text, padding: '.45rem .6rem', borderRadius: 6, fontSize: '.82rem' };

  return (
    <div>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontWeight: 600, fontSize: '1rem', margin: 0 }}>
        <span style={{ display: 'inline-block', width: 4, height: 18, borderRadius: 50, background: colors.green }} />
        {title}
      </h2>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '.3rem' }}>
        <button type="button" onClick={onAddRow} style={{ border: '1px solid var(--verde-hoja, #3fa65b)', color: 'var(--verde-hoja, #3fa65b)', background: 'transparent', borderRadius: 999, padding: '.25rem .6rem', fontSize: '.75rem' }}>{addLabel}</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.8rem', marginTop: '.3rem' }}>
        <thead>
          <tr>
            <th style={{ ...headCell('36%'), textAlign: 'left', color: colors.textSec, padding: '.35rem', borderBottom: `1px solid ${colors.border}` }}>Descripción</th>
            <th style={{ textAlign: 'left', color: colors.textSec, padding: '.35rem', borderBottom: `1px solid ${colors.border}` }}>Cantidad</th>
            <th style={{ textAlign: 'left', color: colors.textSec, padding: '.35rem', borderBottom: `1px solid ${colors.border}` }}>Unidad</th>
            <th style={{ textAlign: 'left', color: colors.textSec, padding: '.35rem', borderBottom: `1px solid ${colors.border}` }}>Precio unitario ($)</th>
            <th style={{ textAlign: 'left', color: colors.textSec, padding: '.35rem', borderBottom: `1px solid ${colors.border}` }}>Costo total ($)</th>
            <th style={{ ...headCell('3%'), borderBottom: `1px solid ${colors.border}` }} />
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx}>
              <td style={{ padding: '.35rem', borderBottom: `1px solid ${colors.border}` }}>
                <input type="text" placeholder="Nuevo costo" value={r.descripcion} onChange={(e) => onRowChange(idx, { ...r, descripcion: e.target.value })} style={inputStyle} />
              </td>
              <td style={{ padding: '.35rem', borderBottom: `1px solid ${colors.border}` }}>
                <input type="number" min={0} step={1} value={r.qty} onChange={(e) => onRowChange(idx, { ...r, qty: e.target.value })} style={inputStyle} />
              </td>
              <td style={{ padding: '.35rem', borderBottom: `1px solid ${colors.border}` }}>
                <input type="text" placeholder="Unidad" value={r.unidad} onChange={(e) => onRowChange(idx, { ...r, unidad: e.target.value })} style={inputStyle} />
              </td>
              <td style={{ padding: '.35rem', borderBottom: `1px solid ${colors.border}` }}>
                <input type="number" min={0} step={0.01} value={r.unit} onChange={(e) => onRowChange(idx, { ...r, unit: e.target.value })} style={inputStyle} />
              </td>
              <td style={{ padding: '.35rem', borderBottom: `1px solid ${colors.border}` }}>
                <input type="number" readOnly value={rowTotal(r) ? rowTotal(r).toFixed(2) : ''} style={inputStyle} />
              </td>
              <td style={{ padding: '.35rem', borderBottom: `1px solid ${colors.border}`, textAlign: 'center' }}>
                <button type="button" onClick={() => onRemoveRow(idx)} style={{ border: '1px solid var(--verde-hoja, #3fa65b)', color: 'var(--verde-hoja, #3fa65b)', background: 'transparent', borderRadius: 999, padding: '.25rem .6rem', fontSize: '.75rem' }}>✖</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} style={{ textAlign: 'right', padding: '.35rem' }}>{totalLabel}:</td>
            <td style={{ padding: '.35rem' }}>
              <input type="number" readOnly value={totalValue ? totalValue.toFixed(2) : ''} style={inputStyle} />
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

// DataTable genérico (oscuro)
export interface Column<T> { key: keyof T | string; header: string; width?: string; align?: 'left' | 'center' | 'right'; render?: (row: T) => React.ReactNode; }
export function DataTable<T extends { [k: string]: any }>({ columns, data, rowKey, onRowClick }: { columns: Column<T>[]; data: T[]; rowKey: (row: T) => string | number; onRowClick?: (row: T) => void; }) {
  const thStyle = (w?: string, align?: 'left'|'center'|'right'): React.CSSProperties => ({ width: w, textAlign: align ?? 'left', color: colors.textSec, padding: 16, borderBottom: `1px solid ${colors.border}` });
  const tdStyle = (align?: 'left'|'center'|'right'): React.CSSProperties => ({ padding: 16, borderBottom: `1px solid ${colors.border}`, textAlign: align ?? 'left', color: colors.text });
  return (
    <div style={{ background: 'var(--panel-actividades, #052a35)', borderRadius: 12, border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: 'rgba(0,0,0,.2)' }}>
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)} style={thStyle(c.width, c.align)}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={rowKey(row)} onClick={() => onRowClick?.(row)} style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
              {columns.map((c) => (
                <td key={String(c.key)} style={tdStyle(c.align)}>
                  {c.render ? c.render(row) : String(row[c.key as any] ?? '')}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{ padding: 32, textAlign: 'center', color: colors.textSec, fontStyle: 'italic' }}>Sin datos</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ProgressBar
export const ProgressBar: React.FC<{ value: number; height?: number; className?: string }>
  = ({ value, height = 8, className }) => (
    <div className={className} style={{ height, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, value))}%`, background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', transition: 'width 0.3s' }} />
    </div>
  );
