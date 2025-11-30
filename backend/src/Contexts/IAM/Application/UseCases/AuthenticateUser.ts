// Caso de uso: Autenticar usuario
import { IUserRepository } from "../../Domain/IUserRepository";

export class AuthenticateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<any> {
    // lógica de autenticación
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");
    // verificar password...
    return user;
  }
}
