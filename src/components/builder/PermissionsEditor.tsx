import { SystemRole } from '@/lib/types';
const cardCls = "rounded-2xl border border-gray-200 bg-white shadow";
const ROLES: SystemRole[] = ['SUPERADMIN','ADMIN','USER'];

export default function PermissionsEditor({ permissions, onChange }:{ permissions:any; onChange:(p:any)=>void }) {
  const Chip = ({ active, onClick, children }:{ active:boolean; onClick:()=>void; children:any }) => (
    <button
      className={`rounded-xl px-3 py-1 text-sm border ${active ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-300'} text-gray-800`}
      onClick={(e)=>{ e.preventDefault(); onClick(); }}
    >{children}</button>
  );

  const multi = (label:string, value:SystemRole[]|undefined, set:(v:SystemRole[])=>void) => (
    <div>
      <label className="text-sm text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-2 mt-1">
        {ROLES.map(r=>{
          const active = value?.includes(r);
          return <Chip key={r} active={!!active} onClick={() => set(active ? (value??[]).filter(x=>x!==r) : [ ...(value??[]), r ])}>{r}</Chip>;
        })}
      </div>
    </div>
  );

  return (
    <div className={`${cardCls} p-4 space-y-4`}>
      <h2 className="text-lg font-semibold" style={{ color: '#1E40AF' }}>Permisos</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {multi('canSubmit', permissions.canSubmit, (v)=>onChange({ ...permissions, canSubmit: v }))}
        {multi('canReview', permissions.canReview, (v)=>onChange({ ...permissions, canReview: v }))}
        {multi('canManageTemplate', permissions.canManageTemplate, (v)=>onChange({ ...permissions, canManageTemplate: v }))}
      </div>
    </div>
  );
}
