import { RowColumn, RowsTemplate } from '@/lib/types';
import { Input, Select, TextArray, Checkbox } from './ui';
import { uniqueKey } from '@/lib/builder-utils';

const cardCls = "rounded-2xl border border-gray-200 bg-white shadow";
const smallBtn = "inline-flex items-center justify-center rounded-xl px-3 py-2 bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 transition";

export default function ColumnsEditor({ schema, onChange }:{
  schema: RowsTemplate['rowSchema']; onChange:(s:RowsTemplate['rowSchema'])=>void;
}) {
  const cols = schema.columns;

  const add = (kind: RowColumn['kind']) => {
    const keys = cols.map(c=>c.key);
    const key = uniqueKey(keys, `${kind}_1`);
    const base: RowColumn = { key, label: key, kind, required: false };
    if (kind==='select') base.options = ['A','B'];
    if (kind==='computed') base.formula = 'MAX(0, 100)';
    onChange({ ...schema, columns: [ ...cols, base ] });
  };

  const update = (idx:number, patch:Partial<RowColumn>) => {
    const next = [...cols]; next[idx] = { ...next[idx], ...patch }; onChange({ ...schema, columns: next });
  };
  const remove = (idx:number) => onChange({ ...schema, columns: cols.filter((_,i)=>i!==idx) });

  return (
    <div className={`${cardCls} p-4 space-y-4`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold" style={{ color: '#1E40AF' }}>Columnas (ROWS)</h2>
        <div className="flex gap-2">
          {(['text','number','date','select','computed'] as RowColumn['kind'][]).map(k=>(
            <button key={k} onClick={()=>add(k)} className={smallBtn}>{k}</button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Input label="minRows" type="number" value={schema.minRows ?? 0} onChange={(v)=>onChange({ ...schema, minRows: v?Number(v):0 })}/>
        <Input label="maxRows" type="number" value={schema.maxRows ?? 1000} onChange={(v)=>onChange({ ...schema, maxRows: v?Number(v):1000 })}/>
      </div>

      <div className="space-y-3">
        {cols.length===0 && <div className="text-sm text-gray-600">No hay columnas. Agrega la primera.</div>}
        {cols.map((c, i)=>(
          <div key={i} className="rounded-xl border border-gray-200 p-3">
            <div className="grid md:grid-cols-6 gap-3">
              <Input label="key" value={c.key} onChange={(v)=>update(i,{ key: v })}/>
              <Input label="label" value={c.label} onChange={(v)=>update(i,{ label: v })}/>
              <Select label="tipo" value={c.kind} options={['text','number','date','select','computed']} onChange={(v)=>update(i,{ kind: v as any })}/>
              <Checkbox label="required" checked={!!(c as any).required} onChange={(val)=>update(i,{ required: val } as any)} />
              <Input label="default" value={(c as any).default ?? ''} onChange={(v)=>update(i,{ default: v } as any)} />
              <div className="text-sm text-gray-600 self-center justify-self-end">#{i+1}</div>
            </div>

            <div className="grid md:grid-cols-4 gap-3 mt-3">
              {c.kind==='number' && (<>
                <Input label="min" type="number" value={(c as any).min ?? ''} onChange={(v)=>update(i,{ min: v===''?undefined:Number(v) } as any)} />
                <Input label="max" type="number" value={(c as any).max ?? ''} onChange={(v)=>update(i,{ max: v===''?undefined:Number(v) } as any)} />
              </>)}
              {c.kind==='select' && (<TextArray label="options" values={(c as any).options ?? []} onChange={(arr)=>update(i,{ options: arr } as any)} />)}
              {c.kind==='computed' && (<Input label="formula" value={(c as any).formula ?? ''} onChange={(v)=>update(i,{ formula: v } as any)} />)}
            </div>

            <div className="mt-3 flex justify-end">
              <button className="text-[#DC2626]" onClick={()=>remove(i)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
