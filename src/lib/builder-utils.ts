import { CheckTemplate, FormTemplate, RowsTemplate } from '@/lib/types';

export const KEY_RGX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

export const emptyCheck = (): CheckTemplate => ({
  id: 'new', slug: '', name: '', type: 'CHECK', version: 1,
  workflow: {
    states: ['draft','submitted','under_review','approved','rejected'],
    transitions: {
      submit: { from: ['draft'], to: 'submitted' },
      start_review: { from: ['submitted'], to: 'under_review' },
      approve: { from: ['under_review'], to: 'approved' },
      reject: { from: ['under_review'], to: 'rejected' },
    }
  },
  fields: [],
  validations: { rules: [] },
  permissions: { canSubmit: ['USER'], canReview: ['ADMIN'], canManageTemplate: ['SUPERADMIN','ADMIN'] },
});

export const emptyRows = (): RowsTemplate => ({
  ...emptyCheck(), type: 'ROWS', rowSchema: { minRows: 1, maxRows: 1000, columns: [] },
});

export function uniqueKey(existing: string[], base: string) {
  let k = base, i = 1; while (existing.includes(k)) k = `${base}${i++}`; return k;
}

export function validateTemplate(t: FormTemplate): Record<string,string> {
  const errs: Record<string,string> = {};
  if (!t.name?.trim()) errs.name = 'Nombre requerido';
  if (!t.slug?.trim()) errs.slug = 'Slug requerido';
  if (t.slug && !KEY_RGX.test(t.slug)) errs.slug = 'Slug inválido';

  if (t.type==='CHECK') {
    const keys = new Set<string>();
    for (const f of t.fields) {
      if (!f.key || !KEY_RGX.test(f.key)) { errs._fatal = 'Keys inválidas en campos'; break; }
      if (keys.has(f.key)) { errs._fatal = 'Keys duplicadas en campos'; break; }
      keys.add(f.key);
      if (!f.label?.trim()) { errs._fatal = 'Labels vacíos en campos'; break; }
      if (f.kind==='select' && !(f as any).options?.length) { errs._fatal = `El campo ${f.key} requiere options`; break; }
      if (f.kind==='computed' && !(f as any).formula) { errs._fatal = `El campo ${f.key} requiere fórmula`; break; }
    }
  } else {
    const s = (t as RowsTemplate).rowSchema;
    if ((s.minRows ?? 0) > (s.maxRows ?? 0)) errs._fatal = 'minRows > maxRows';
    const keys = new Set<string>();
    for (const c of s.columns) {
      if (!c.key || !KEY_RGX.test(c.key)) { errs._fatal = 'Keys inválidas en columnas'; break; }
      if (keys.has(c.key)) { errs._fatal = 'Keys duplicadas en columnas'; break; }
      keys.add(c.key);
      if (!c.label?.trim()) { errs._fatal = 'Labels vacíos en columnas'; break; }
      if (c.kind==='select' && !(c as any).options?.length) { errs._fatal = `La columna ${c.key} requiere options`; break; }
      if (c.kind==='computed' && !(c as any).formula) { errs._fatal = `La columna ${c.key} requiere fórmula`; break; }
    }
    if (!s.columns.length) errs._fatal = 'Al menos una columna';
  }
  return errs;
}
