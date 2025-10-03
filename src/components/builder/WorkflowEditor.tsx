const cardCls = "rounded-2xl border border-gray-200 bg-white shadow";

export default function WorkflowEditor({ transitions, onChange }:{ transitions:any; onChange:(t:any)=>void }) {
  const cfg = [
    { key:'submit', from:'draft', to:'submitted', label:'submit: draft → submitted' },
    { key:'start_review', from:'submitted', to:'under_review', label:'start_review: submitted → under_review' },
    { key:'approve', from:'under_review', to:'approved', label:'approve: under_review → approved' },
    { key:'reject', from:'under_review', to:'rejected', label:'reject: under_review → rejected' },
  ];
  return (
    <div className={`${cardCls} p-4 space-y-4`}>
      <h2 className="text-lg font-semibold" style={{ color: '#1E40AF' }}>Workflow</h2>
      <div className="space-y-2 text-gray-800">
        {cfg.map(c=>{
          const enabled = !!transitions[c.key];
          return (
            <label key={c.key} className="flex items-center gap-2">
              <input type="checkbox" checked={enabled} onChange={(e)=>{
                const t = { ...transitions };
                if (e.target.checked) t[c.key] = { from: [c.from], to: c.to }; else delete t[c.key];
                onChange(t);
              }}/>
              <span>{c.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
