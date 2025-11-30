// Entidad Profile para Social
import { AggregateRoot } from "../../Shared/Domain/AggregateRoot";

export interface ProfileProps {
  userId: string;
  avatar: string;
  bio: string;
  alias: string;
}

export class Profile extends AggregateRoot<ProfileProps> {
  constructor(id: string, props: ProfileProps) {
    super(id);
    this.props = props;
  }
}
