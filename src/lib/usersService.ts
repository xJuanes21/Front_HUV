// lib/usersService.ts - ACTUALIZAR COMPLETAMENTE
import { authService } from './auth';

export interface User {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  rol: 'admin' | 'user' | 'editor';
  status?: 'Activo' | 'Inactivo';
  createdAt?: string;
  canAccessDocument?: (documentId: number, permission: string) => boolean;
}


export interface DocumentPermission {
  document_id: number;
  document_name: string;
  document_slug: string;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

export interface CreateUserData {
  nombre: string;
  correo: string;
  password: string;
  telefono: string;
  rol: 'admin' | 'user' | 'editor';
  document_permissions?: DocumentPermission[];
}

export interface UpdateUserData {
  nombre?: string;
  correo?: string;
  password?: string;
  telefono?: string;
  rol?: 'admin' | 'user' | 'editor';
  document_permissions?: DocumentPermission[];
}

export interface UpdateUserPermissionsData {
  permissions: DocumentPermission[];
}

class UsersService {
  private baseURL = 'http://localhost:8000/api';

  private async getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No authentication token found');
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseURL}/users`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error fetching users');
    }

    return response.json();
  }

  async getUserById(id: number): Promise<User> {
    const response = await fetch(`${this.baseURL}/users/${id}`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error fetching user');
    }

    return response.json();
  }

  async createUser(userData: CreateUserData): Promise<User> {
    const response = await fetch(`${this.baseURL}/users`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error creating user');
    }

    const user = await response.json();

    // Si hay permisos de documentos, asignarlos después de crear el usuario
    if (userData.document_permissions && userData.document_permissions.length > 0) {
      await this.updateUserDocumentPermissions(user.id, {
        permissions: userData.document_permissions
      });
    }

    return user;
  }

  async updateUser(id: number, userData: UpdateUserData): Promise<User> {
    const response = await fetch(`${this.baseURL}/users/${id}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error updating user');
    }

    return response.json();
  }

  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${this.baseURL}/users/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error deleting user');
    }
  }

  // 🔽 NUEVOS MÉTODOS PARA PERMISOS DE DOCUMENTOS 🔽

  async getUserDocumentPermissions(userId: number): Promise<DocumentPermission[]> {
    const response = await fetch(`${this.baseURL}/users/${userId}/document-permissions`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error fetching user document permissions');
    }

    const data = await response.json();
    return data.data;
  }

  async updateUserDocumentPermissions(userId: number, permissionsData: UpdateUserPermissionsData): Promise<DocumentPermission[]> {
    const response = await fetch(`${this.baseURL}/users/${userId}/document-permissions`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(permissionsData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error updating user permissions');
    }

    const data = await response.json();
    return data.data;
  }

  async deleteUserDocumentPermission(userId: number, documentId: number): Promise<void> {
    const response = await fetch(`${this.baseURL}/users/${userId}/document-permissions/${documentId}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error deleting document permission');
    }
  }

}

export const usersService = new UsersService();