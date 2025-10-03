export type SystemRole = 'SUPERADMIN' | 'ADMIN' | 'USER';

export type FormType = 'CHECK' | 'ROWS';
export type WorkflowState = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

export interface TransitionDef { from: WorkflowState[]; to: WorkflowState; }
export type WorkflowTransitions = Record<string, TransitionDef>;

export type FieldKind =
  | 'boolean' | 'text' | 'number' | 'date' | 'select'
  | 'file' | 'signature' | 'photo' | 'computed';

export interface BaseField {
  key: string; label: string; kind: FieldKind; required?: boolean;
  visibleIf?: { field: string; equals: any };
}

export interface SelectField extends BaseField { kind: 'select'; options: (string|number)[]; }
export interface BooleanField extends BaseField { kind: 'boolean'; na?: boolean; }
export interface TextField extends BaseField { kind: 'text'; maxLength?: number; pattern?: string; }
export interface NumberField extends BaseField { kind: 'number'; min?: number; max?: number; }
export interface DateField extends BaseField { kind: 'date'; minDate?: string; maxDate?: string; }
export interface FileField extends BaseField { kind: 'file'; mime?: string[]; maxSizeMB?: number; }
export interface ComputedField extends BaseField { kind: 'computed'; formula: string; }

export type CheckField =
  | SelectField | BooleanField | TextField | NumberField | DateField | FileField | ComputedField;

export interface CheckValidRule {
  if: { field: string; equals: any };
  then: { field: string; required?: boolean; min?: number; max?: number; pattern?: string };
}
export interface TemplateValidations { rules?: CheckValidRule[]; }

export interface TemplatePermissions {
  canSubmit?: SystemRole[];
  canReview?: SystemRole[];
  canManageTemplate?: SystemRole[];
}

export interface BaseTemplate {
  id: string; slug: string; name: string; type: FormType; version: number;
  workflow: { states: WorkflowState[]; transitions: WorkflowTransitions };
  permissions?: TemplatePermissions;
}

export interface CheckTemplate extends BaseTemplate {
  type: 'CHECK';
  fields: CheckField[];
  validations?: TemplateValidations;
}

export interface RowColumn extends Omit<BaseField,'kind'> {
  kind: Exclude<FieldKind,'file'|'photo'|'signature'>|'computed';
  default?: any; min?: number; max?: number; formula?: string; options?: (string|number)[];
}

export interface RowsTemplate extends BaseTemplate {
  type: 'ROWS';
  rowSchema: { minRows?: number; maxRows?: number; columns: RowColumn[] };
  permissions?: TemplatePermissions;
}

export type FormTemplate = CheckTemplate | RowsTemplate;

export interface AppUser { id: string; name: string; email: string; role: SystemRole; }
export interface FormAssignment {
  id: string; userId: string; formTemplateId: string;
  pinVersion: boolean; assignedVersion?: number | null;
}
