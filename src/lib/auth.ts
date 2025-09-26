// lib/auth.ts
export interface User {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  rol: 'admin' | 'user' | 'editor';
}

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;
}

class AuthService {
  private baseURL = 'http://localhost:8000/api';

  async login(correo: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en el login');
    }

    return response.json();
  }

  async logout(token: string): Promise<void> {
    await fetch(`${this.baseURL}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${this.baseURL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo usuario');
    }

    const data = await response.json();
    return data.user;
  }

  // Verificar si el token está expirado (simple check)
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}

export const authService = new AuthService();