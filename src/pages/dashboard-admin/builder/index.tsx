'use client'

import { useEffect, useMemo, useState } from 'react';
import { CheckTemplate, FormTemplate, RowsTemplate } from '@/lib/types';
import { emptyCheck, emptyRows, validateTemplate } from '@/lib/builder-utils';
import MetaEditor from '@/components/builder/MetaEditor';
import FieldsEditor from '@/components/builder/FieldsEditor';
import ColumnsEditor from '@/components/builder/ColumnsEditor';
import RulesEditor from '@/components/builder/RulesEditor';
import WorkflowEditor from '@/components/builder/WorkflowEditor';
import PermissionsEditor from '@/components/builder/PermissionsEditor';
import PreviewTemplate from '@/components/builder/PreviewTemplate';
import { SectionButton } from '@/components/builder/ui';
import DashboardLayout from '../layout';

type Tab = 'meta'|'fields'|'columns'|'rules'|'workflow'|'permissions'|'preview';

const cardCls = "rounded-2xl border border-gray-200 bg-white shadow";
const btnPrimary = "inline-flex items-center justify-center rounded-xl px-3 py-2 text-white border border-transparent";
const btnOutline = "inline-flex items-center justify-center rounded-xl px-3 py-2 bg-white border border-[#1E40AF] text-[#1E40AF] hover:bg-gray-50 transition";

export default function BuilderPage() {
  const [tab, setTab] = useState<Tab>('meta');
  const [tpl, setTpl] = useState<FormTemplate>(emptyCheck());
  const [saving, setSaving] = useState(false);
  const [autosaveAt, setAutosaveAt] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => { saveDraft(false).catch(()=>{}); }, 1500);
    return () => clearTimeout(t);
  }, [tpl]);

  const errors = useMemo(() => validateTemplate(tpl), [tpl]);

  async function saveDraft(showToast = true) {
    setSaving(true);
    try {
      const res = await fetch('/api/form-templates', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: tpl })
      });
      if (!res.ok) throw new Error('save failed');
      const saved = await res.json();
      setAutosaveAt(new Date().toLocaleTimeString());
      if (showToast) alert('Guardado ✓');
      if (saved?.id && tpl.id === 'new') setTpl((t) => ({ ...t, id: saved.id }));
    } finally { setSaving(false); }
  }

  const changeType = (type: 'CHECK'|'ROWS') => {
    if (type === tpl.type) return;
    setTpl(type === 'CHECK' ? emptyCheck() : emptyRows());
    setTab(type === 'CHECK' ? 'fields' : 'columns');
  };

  return (
    <DashboardLayout>
    <main className="p-0">
      {/* HERO (azul, texto blanco) */}
      <section className="rounded-b-3xl shadow text-white"
               style={{ background: '#1E40AF' }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-semibold text-center">Form Builder</h1>
          <p className="text-blue-100 text-center">Crea y edita plantillas dinámicas (CHECK / ROWS)</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 space-y-2">
          <SectionButton label="Metadatos" active={tab==='meta'} onClick={()=>setTab('meta')} />
          <SectionButton label="Campos (CHECK)" active={tab==='fields'} disabled={tpl.type!=='CHECK'} onClick={()=>setTab('fields')} />
          <SectionButton label="Columnas (ROWS)" active={tab==='columns'} disabled={tpl.type!=='ROWS'} onClick={()=>setTab('columns')} />
          <SectionButton label="Validaciones y Reglas" active={tab==='rules'} onClick={()=>setTab('rules')} />
          <SectionButton label="Workflow" active={tab==='workflow'} onClick={()=>setTab('workflow')} />
          <SectionButton label="Permisos" active={tab==='permissions'} onClick={()=>setTab('permissions')} />
          <SectionButton label="Preview" active={tab==='preview'} onClick={()=>setTab('preview')} />

          <div className={`${cardCls} mt-4 p-3 space-y-2`}>
            <button
              onClick={()=>saveDraft(true)}
              className={`${btnPrimary}`}
              style={{ background: 'linear-gradient(180deg, #1E4BC7 0%, #1E40AF 100%)' }}
              disabled={!!errors._fatal || saving}
            >
              Guardar borrador
            </button>
            <button className={`${btnOutline} opacity-40 cursor-not-allowed`} title="Fuera de alcance por ahora" disabled>
              Publicar
            </button>
            <div className="text-xs text-gray-600 pt-2 border-t">
              {saving ? 'Guardando…' : autosaveAt ? `Guardado ${autosaveAt}` : 'Sin cambios'}
            </div>
            {errors._fatal && <div className="text-[#DC2626] text-sm">{errors._fatal}</div>}
          </div>
        </aside>

        {/* Canvas */}
        <section className="col-span-12 md:col-span-9 space-y-6">
          {tab==='meta' && (
            <MetaEditor
              slug={tpl.slug}
              name={tpl.name}
              type={tpl.type}
              version={tpl.version}
              onChange={(p)=>setTpl(t=>({ ...t, ...p } as any))}
              onTypeChange={changeType}
              errors={errors}
            />
          )}
          {tab==='fields' && tpl.type==='CHECK' && (
            <FieldsEditor
              fields={(tpl as CheckTemplate).fields}
              onChange={(fields)=>setTpl(t=>({ ...(t as CheckTemplate), fields }))}
            />
          )}
          {tab==='columns' && tpl.type==='ROWS' && (
            <ColumnsEditor
              schema={(tpl as RowsTemplate).rowSchema}
              onChange={(rowSchema)=>setTpl(t=>({ ...(t as RowsTemplate), rowSchema }))}
            />
          )}
          {tab==='rules' && (
            <RulesEditor
              type={tpl.type}
              validations={(tpl as any).validations}
              onChange={(validations)=>setTpl(t=>({ ...(t as any), validations }))}
              fieldsOrColumns={tpl.type==='CHECK'
                ? (tpl as CheckTemplate).fields.map(f=>f.key)
                : (tpl as RowsTemplate).rowSchema.columns.map(c=>c.key)}
            />
          )}
          {tab==='workflow' && (
            <WorkflowEditor
              transitions={tpl.workflow.transitions}
              onChange={(transitions)=>setTpl(t=>({ ...t, workflow: { ...t.workflow, transitions } }))}
            />
          )}
          {tab==='permissions' && (
            <PermissionsEditor
              permissions={tpl.permissions ?? {}}
              onChange={(permissions)=>setTpl(t=>({ ...t, permissions }))}
            />
          )}
          {tab==='preview' && <PreviewTemplate template={tpl} />}
        </section>
      </div>
    </main>
    </DashboardLayout>
  );
}
