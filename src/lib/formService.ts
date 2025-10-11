// lib/formService.ts
import { CreateFormData, DynamicForm, FormRecord } from "@/components/forms-module/types/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Tipo para la respuesta de registros del API
interface RecordsResponse {
  data?: FormRecord[];
  records?: FormRecord[];
}

// Tipo union que incluye todas las posibles respuestas
type GetRecordsResponse = FormRecord[] | RecordsResponse;

class FormsService {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  /**
   * Obtener todos los formularios
   */
  async getAllForms(): Promise<DynamicForm[]> {
    const response = await fetch(`${API_URL}/api/forms`, {
      method: 'GET',
      headers: this.getAuthHeader()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener formularios');
    }

    return response.json();
  }

  /**
   * Obtener un formulario por ID
   */
  async getFormById(id: number): Promise<DynamicForm> {
    const response = await fetch(`${API_URL}/api/forms/${id}`, {
      method: 'GET',
      headers: this.getAuthHeader()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener formulario');
    }

    return response.json();
  }

  /**
   * Crear un nuevo formulario dinámico
   */
  async createForm(data: CreateFormData): Promise<DynamicForm> {
    const response = await fetch(`${API_URL}/api/forms`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear formulario');
    }

    return response.json();
  }

  /**
   * Actualizar un formulario existente
   */
  async updateForm(id: number, data: Partial<CreateFormData>): Promise<DynamicForm> {
    const response = await fetch(`${API_URL}/api/forms/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeader(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar formulario');
    }

    return response.json();
  }

  /**
   * Eliminar un formulario
   */
  async deleteForm(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/forms/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar formulario');
    }
  }

  /**
   * Obtener registros de un formulario
   * ✅ CORREGIDO: Retorna el tipo union correcto
   */
  async getFormRecords(formId: number): Promise<GetRecordsResponse> {
    const response = await fetch(`${API_URL}/api/forms/${formId}/records`, {
      method: 'GET',
      headers: this.getAuthHeader()
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error al obtener registros' }));
      throw new Error(error.message || 'Error al obtener registros');
    }

    return response.json();
  }

  /**
   * Normalizar la respuesta de registros a un array
   * Método helper para convertir cualquier formato a FormRecord[]
   */
  normalizeRecordsResponse(response: GetRecordsResponse): FormRecord[] {
    if (Array.isArray(response)) {
      return response;
    } else if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.records && Array.isArray(response.records)) {
      return response.records;
    }
    return [];
  }

  /**
   * Crear un registro en un formulario
   */
  async createFormRecord(formId: number, data: Record<string, any>): Promise<FormRecord> {
    const response = await fetch(`${API_URL}/api/forms/${formId}/records`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error al crear registro' }));
      throw new Error(error.message || 'Error al crear registro');
    }

    const result = await response.json();
    return result.record || result;
  }

  /**
   * Actualizar un registro de un formulario
   */
  async updateFormRecord(formId: number, recordId: number, data: Record<string, any>): Promise<FormRecord> {
    const response = await fetch(`${API_URL}/api/forms/${formId}/records/${recordId}`, {
      method: 'PUT',
      headers: this.getAuthHeader(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error al actualizar registro' }));
      throw new Error(error.message || 'Error al actualizar registro');
    }

    const result = await response.json();
    return result.record || result;
  }

  /**
   * Eliminar un registro de un formulario
   */
  async deleteFormRecord(formId: number, recordId: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/forms/${formId}/records/${recordId}`, {
      method: 'DELETE',
      headers: this.getAuthHeader()
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error al eliminar registro' }));
      throw new Error(error.message || 'Error al eliminar registro');
    }
  }

  /**
   * Generar slug automáticamente desde el nombre
   */
  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

export const formsService = new FormsService();
export type { DynamicForm, CreateFormData, FormRecord, GetRecordsResponse };