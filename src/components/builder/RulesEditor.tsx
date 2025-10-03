import { Select, Input } from './ui';

const cardCls = "rounded-2xl border border-gray-200 bg-white shadow";
const smallBtn = "inline-flex items-center justify-center rounded-xl px-3 py-2 bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 transition";

export default function RulesEditor({
  type, validations, onChange, fieldsOrColumns
}:{
  type: 'CHECK'|'ROWS';
  validations: any;
  onChange: (v:any)=>void;
  fieldsOrColumns: string[];
}) {
  const rules = validations?.rules ?? [];
  const add = () => onChange({ rules: [ ...rules, { if:{ field: fieldsOrColumns[0] ?? '', equals:'' }, then:{ field: fieldsOrColumns[0] ?? '', required:true } } ] });
  const update = (idx:number, patch:any) => { const next = [...rules]; next[idx] = { ...next[idx], ...patch }; onChange({ rules: next }); };
  const remove = (idx:number) => onChange({ rules: rules.filter((_:any,i:number)=>i!==idx) });

  return (
    <div className={`${cardCls} p-4 space-y-4`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold" style={{ color: '#1E40AF' }}>Validaciones y Reglas ({type})</h2>
        <button className={smallBtn} onClick={add}>Agregar regla</button>
      </div>

      <div className="space-y-3">
        {rules.length===0 && <div className="text-sm text-gray-600">Aún no hay reglas.</div>}
        {rules.map((r:any, i:number)=>(
          <div key={i} className="rounded-xl border border-gray-200 p-3 grid md:grid-cols-6 gap-3">
            <Select label="IF.field" value={r.if.field} options={fieldsOrColumns} onChange={(v)=>update(i,{ if:{ ...r.if, field: v } })}/>
            <Input label="IF.equals" value={r.if.equals ?? ''} onChange={(v)=>update(i,{ if:{ ...r.if, equals: v } })}/>
            <Select label="THEN.field" value={r.then.field} options={fieldsOrColumns} onChange={(v)=>update(i,{ then:{ ...r.then, field: v } })}/>
            <Select label="THEN.rule" value={r.then.required ? 'required' : (r.then.min!=null?'min':(r.then.max!=null?'max':(r.then.pattern?'pattern':'')))} options={['required','min','max','pattern']} onChange={(v)=>{
              const base:any = { field: r.then.field };
              if (v==='required') base.required = true;
              if (v==='min') base.min = 0;
              if (v==='max') base.max = 100;
              if (v==='pattern') base.pattern = '^[A-Za-z]+$';
              update(i,{ then: base });
            }}/>
            <Input label="THEN.value" value={r.then.required ? 'true' : (r.then.min ?? r.then.max ?? r.then.pattern ?? '')}
              onChange={(val)=>{
                const then:any = { field: r.then.field };
                if (r.then.required) then.required = true;
                if (r.then.min!=null) then.min = Number(val);
                if (r.then.max!=null) then.max = Number(val);
                if (r.then.pattern) then.pattern = val;
                update(i,{ then });
              }}/>
            <button className="text-[#DC2626]" onClick={()=>remove(i)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
