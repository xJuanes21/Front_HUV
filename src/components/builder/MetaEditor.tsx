import { FormTemplate } from '@/lib/types';
import { Input } from './ui';

const cardCls = "rounded-2xl border border-gray-200 bg-white shadow";

export default function MetaEditor({
  slug, name, type, version, onChange, onTypeChange, errors
}:{
  slug:string; name:string; type:'CHECK'|'ROWS'; version:number;
  onChange:(p: Partial<FormTemplate>)=>void;
  onTypeChange:(t:'CHECK'|'ROWS')=>void;
  errors: Record<string,string>;
}) {
  return (
    <div className={`${cardCls} p-4 space-y-4`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold" style={{ color: '#1E40AF' }}>Metadatos</h2>
        <div className="text-sm text-gray-600">Estado: <b>draft</b> · v{version}</div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Input label="Nombre" value={name} onChange={(v)=>onChange({ name: v })}/>
          {errors.name && <p className="text-xs text-[#DC2626]">{errors.name}</p>}
        </div>
        <div>
          <Input label="Slug" value={slug} onChange={(v)=>onChange({ slug: v })}/>
          {errors.slug && <p className="text-xs text-[#DC2626]">{errors.slug}</p>}
        </div>
        <div className="col-span-2">
          <label className="text-sm text-gray-700 block mb-2">Tipo</label>
          <div className="inline-flex rounded-xl border border-gray-300 overflow-hidden">
            <button onClick={()=>onTypeChange('CHECK')}
                    className={`px-4 py-2 ${type==='CHECK'?'bg-gray-100':''}`}>CHECK</button>
            <button onClick={()=>onTypeChange('ROWS')}
                    className={`px-4 py-2 ${type==='ROWS'?'bg-gray-100':''}`}>ROWS</button>
          </div>
        </div>
      </div>
    </div>
  );
}
