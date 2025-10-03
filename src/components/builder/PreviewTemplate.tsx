import { CheckTemplate, FormTemplate, RowsTemplate } from '@/lib/types';
const cardCls = "rounded-2xl border border-gray-200 bg-white shadow";

export default function PreviewTemplate({ template }:{ template: FormTemplate }) {
  return (
    <div className="space-y-4">
      <div className={`${cardCls} p-4`}>
        <h2 className="text-lg font-semibold mb-3" style={{ color: '#1E40AF' }}>Preview</h2>
        {template.type==='CHECK' ? (
          <div className="space-y-3">
            {(template as CheckTemplate).fields.map(f=>(
              <div key={f.key}>
                <label className="text-sm text-gray-700 block">{f.label}</label>
                {f.kind==='text' && <input className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900" placeholder="texto…"/>}
                {f.kind==='number' && <input type="number" className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900" placeholder="0" />}
                {f.kind==='date' && <input type="date" className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900" />}
                {f.kind==='select' && (
                  <select className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 bg-white">
                    <option value="">Seleccione…</option>
                    {(f as any).options?.map((o:any)=><option key={String(o)}>{String(o)}</option>)}
                  </select>
                )}
                {f.kind==='boolean' && <input type="checkbox" />}
                {f.kind==='file' && <button className="inline-flex items-center justify-center rounded-xl px-3 py-2 bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 transition">Subir archivo</button>}
                {f.kind==='computed' && <div className="rounded-xl border border-gray-200 px-3 py-2 bg-gray-50 text-gray-700">[valor calculado]</div>}
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-[700px] w-full border border-gray-200 text-gray-900">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  {(template as RowsTemplate).rowSchema.columns.map(c=>(
                    <th key={c.key} className="border border-gray-200 px-2 py-1 text-left">{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[0,1].map((r)=>(
                  <tr key={r}>
                    {(template as RowsTemplate).rowSchema.columns.map(c=>(
                      <td key={c.key} className="border border-gray-200 px-2 py-1 text-sm text-gray-700">
                        {c.kind==='computed' ? '[calc]' : (c.kind==='select' ? '—' : '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={`${cardCls} p-4 bg-white`}>
        <h3 className="font-semibold mb-2 text-sm text-gray-700">Schema JSON</h3>
        <pre className="text-xs overflow-auto text-gray-800">{JSON.stringify(template, null, 2)}</pre>
      </div>
    </div>
  );
}
