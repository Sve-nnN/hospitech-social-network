// Caso de uso: Registrar usuario
import { IUserRepository } from "../../Domain/IUserRepository";
import { User } from "../../Domain/User";

export class RegisterUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: any): Promise<void> {
    // lógica de registro
    const user = new User(data.id, data);
    await this.userRepository.save(user);
  }
}
