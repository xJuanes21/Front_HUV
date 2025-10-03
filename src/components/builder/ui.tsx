import { useEffect, useState } from 'react';

export function SectionButton({ label, active, onClick, disabled=false }:{
  label:string; active:boolean; onClick:()=>void; disabled?:boolean;
}) {
  return (
    <button
      className={`w-full text-left rounded-xl border px-3 py-2 ${
        active ? 'bg-gray-50 border-gray-300' : 'border-gray-200'
      } ${disabled?'opacity-40 cursor-not-allowed':''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="text-gray-800">{label}</span>
    </button>
  );
}

export function Input({ label, value, onChange, type='text' }:{
  label:string; value:any; onChange:(v:string)=>void; type?:string;
}) {
  return (
    <div>
      <label className="text-sm text-gray-700">{label}</label>
      <input className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900"
             value={value} onChange={(e)=>onChange(e.target.value)} type={type}/>
    </div>
  );
}

export function Select({ label, value, onChange, options }:{
  label:string; value:any; onChange:(v:string)=>void; options:string[];
}) {
  return (
    <div>
      <label className="text-sm text-gray-700">{label}</label>
      <select className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 bg-white"
              value={value} onChange={(e)=>onChange(e.target.value)}>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function Checkbox({ label, checked, onChange }:{
  label:string; checked:boolean; onChange:(v:boolean)=>void;
}) {
  return (
    <label className="flex items-center gap-2 text-gray-800">
      <input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)}/>
      <span>{label}</span>
    </label>
  );
}

export function TextArray({ label, values, onChange }:{
  label:string; values:string[]; onChange:(arr:string[])=>void;
}) {
  const [txt, setTxt] = useState(values.join(','));
  useEffect(()=>{ setTxt(values.join(',')); }, [values]);
  return (
    <div>
      <label className="text-sm text-gray-700">{label}</label>
      <input className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900"
             value={txt}
             onChange={(e)=>{ setTxt(e.target.value);
               onChange(e.target.value.split(',').map(s=>s.trim()).filter(Boolean)); }}/>
      <p className="text-xs text-gray-500">Separadas por coma</p>
    </div>
  );
}
