// Value Object para Email
import { ValueObject } from "../../../Shared/Domain/ValueObject";

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  constructor(value: string) {
    if (!value.includes("@")) throw new Error("Email inválido");
    super({ value });
  }

  get value() {
    return this.props.value;
  }
}
