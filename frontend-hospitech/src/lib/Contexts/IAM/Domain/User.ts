// Dominio: User
export type UserRole = 'admin' | 'user';
export interface IUser {
	id: string;
	email: string;
	username: string;
	nombre?: string;
	apellido?: string;
	imagen_perfil_url?: string;
	fullName?: string;
	emailVerified?: boolean;
	status?: 'Active' | 'Banned';
	mfaEnabled?: boolean;
	role?: UserRole;
}
