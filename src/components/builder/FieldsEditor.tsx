import { CheckField } from '@/lib/types';
import { Checkbox, Input, TextArray } from './ui';
import { uniqueKey } from '@/lib/builder-utils';

const cardCls = "rounded-2xl border border-gray-200 bg-white shadow";

export default function FieldsEditor({ fields, onChange }:{
  fields: CheckField[]; onChange:(f:CheckField[])=>void;
}) {
  const add = (kind: CheckField['kind']) => {
    const keys = fields.map(f=>f.key);
    const key = uniqueKey(keys, `${kind}_1`);
    const base = { key, label: key, kind, required: false } as any;
    if (kind==='select') base.options = ['Opción A','Opción B'];
    if (kind==='file') { base.mime = ['image/*']; base.maxSizeMB = 10; }
    if (kind==='computed') base.formula = 'MAX(0, 100)';
    onChange([ ...fields, base ]);
  };

  const update = (idx:number, patch:Partial<CheckField>) => {
    const next = [...fields]; next[idx] = { ...next[idx], ...patch } as CheckField; onChange(next);
  };
  const remove = (idx:number) => onChange(fields.filter((_,i)=>i!==idx));

  const btn = "inline-flex items-center justify-center rounded-xl px-3 py-2 bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 transition";

  return (
    <div className={`${cardCls} p-4 space-y-4`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold" style={{ color: '#1E40AF' }}>Campos (CHECK)</h2>
        <div className="flex gap-2">
          {(['text','number','date','select','boolean','file','computed'] as CheckField['kind'][]).map(k=>(
            <button key={k} onClick={()=>add(k)} className={btn}>{k}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {fields.length===0 && <div className="text-sm text-gray-600">No hay campos. Agrega el primero.</div>}
        {fields.map((f, i)=>(
          <div key={i} className="rounded-xl border border-gray-200 p-3">
            <div className="grid md:grid-cols-4 gap-3">
              <Input label="key" value={f.key} onChange={(v)=>update(i,{ key: v })}/>
              <Input label="label" value={f.label} onChange={(v)=>update(i,{ label: v })}/>
              <div className="flex items-center gap-2 text-gray-800">
                <input id={`req-${i}`} type="checkbox" checked={!!f.required} onChange={(e)=>update(i,{ required: e.target.checked })}/>
                <label htmlFor={`req-${i}`}>required</label>
              </div>
              <div className="text-sm text-gray-600">tipo: <b className="text-gray-800">{f.kind}</b></div>
            </div>

            <div className="grid md:grid-cols-4 gap-3 mt-3">
              {f.kind==='text' && (<>
                <Input label="maxLength" type="number" value={(f as any).maxLength ?? ''} onChange={(v)=>update(i,{ maxLength: v?Number(v):undefined } as any)}/>
                <Input label="pattern" value={(f as any).pattern ?? ''} onChange={(v)=>update(i,{ pattern: v } as any)}/>
              </>)}
              {f.kind==='number' && (<>
                <Input label="min" type="number" value={(f as any).min ?? ''} onChange={(v)=>update(i,{ min: v===''?undefined:Number(v) } as any)}/>
                <Input label="max" type="number" value={(f as any).max ?? ''} onChange={(v)=>update(i,{ max: v===''?undefined:Number(v) } as any)}/>
              </>)}
              {f.kind==='date' && (<>
                <Input label="minDate" value={(f as any).minDate ?? ''} onChange={(v)=>update(i,{ minDate: v } as any)}/>
                <Input label="maxDate" value={(f as any).maxDate ?? ''} onChange={(v)=>update(i,{ maxDate: v } as any)}/>
              </>)}
              {f.kind==='select' && (<TextArray label="options" values={(f as any).options ?? []} onChange={(arr)=>update(i,{ options: arr } as any)} />)}
              {f.kind==='boolean' && (<Checkbox label="N/A habilitado" checked={(f as any).na ?? false} onChange={(val)=>update(i,{ na: val } as any)} />)}
              {f.kind==='file' && (<>
                <TextArray label="mime" values={(f as any).mime ?? []} onChange={(arr)=>update(i,{ mime: arr } as any)} />
                <Input label="maxSizeMB" type="number" value={(f as any).maxSizeMB ?? 10} onChange={(v)=>update(i,{ maxSizeMB: v?Number(v):10 } as any)}/>
              </>)}
              {f.kind==='computed' && (<Input label="formula" value={(f as any).formula ?? ''} onChange={(v)=>update(i,{ formula: v } as any)} />)}
            </div>

            <details className="mt-3">
              <summary className="cursor-pointer text-gray-800">Visible if…</summary>
              <div className="grid md:grid-cols-3 gap-3 mt-2">
                <Input label="field" value={(f as any).visibleIf?.field ?? ''} onChange={(v)=>update(i,{ visibleIf: { ...(f as any).visibleIf, field: v } } as any)} />
                <Input label="equals" value={(f as any).visibleIf?.equals ?? ''} onChange={(v)=>update(i,{ visibleIf: { ...(f as any).visibleIf, equals: v } } as any)} />
                <button className={btn} onClick={()=>update(i,{ visibleIf: undefined } as any)}>Limpiar</button>
              </div>
            </details>

            <div className="mt-3 flex justify-between">
              <button className="text-[#DC2626]" onClick={()=>remove(i)}>Eliminar</button>
              <span className="text-xs text-gray-500">#{i+1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
