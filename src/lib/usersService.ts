// lib/usersService.ts
import { authService } from './auth';

export interface User {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  rol: 'admin' | 'user' | 'editor';
  // Adaptamos los campos para que coincidan con tu backend
  status?: 'Activo' | 'Inactivo'; // Podemos agregar este campo si lo necesitas
  createdAt?: string;
}

export interface CreateUserData {
  nombre: string;
  correo: string;
  password: string;
  telefono: string;
  rol: 'admin' | 'user' | 'editor';
}

export interface UpdateUserData {
  nombre?: string;
  correo?: string;
  password?: string;
  telefono?: string;
  rol?: 'admin' | 'user' | 'editor';
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

    return response.json();
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
}

export const usersService = new UsersService();