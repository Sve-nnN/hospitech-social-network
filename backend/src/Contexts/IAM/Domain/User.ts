// Entidad User para IAM
import { AggregateRoot } from "../../Shared/Domain/AggregateRoot";

export interface UserProps {
  email: string;
  emailVerified: boolean;
  status: "Active" | "Banned";
  mfaEnabled: boolean;
  fullName: string;
}

export class User extends AggregateRoot<UserProps> {
  constructor(id: string, props: UserProps) {
    super(id);
    this.props = props;
  }

  changePassword(newPassword: string) {
    // lógica de cambio de contraseña
  }
}
