import { User } from '@/lib/usersService';

export type UserStatus = 'Activo' | 'Inactivo';
export type UserRole = 'admin' | 'user' | 'editor';

export interface UserFormData {
  nombre: string;
  correo: string;
  password: string;
  telefono: string;
  rol: UserRole;
  status?: UserStatus;
}

// Modal de Crear
export interface CreateUserModalProps {
  isOpen: boolean;
  onSubmit: (data: UserFormData) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

// Modal de Editar
export interface EditUserModalProps {
  isOpen: boolean;
  user: User | null;
  onSubmit: (data: UserFormData) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

// Modal de Eliminar
export interface DeleteUserModalProps {
  isOpen: boolean;
  user: User | null;
  onConfirm: (userId: number) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}