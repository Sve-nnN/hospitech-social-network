// Dominio: User
export interface IUser {
	id: string;
	email: string;
	fullName: string;
	emailVerified: boolean;
	status: 'Active' | 'Banned';
	mfaEnabled: boolean;
}
