// Entidad Post para Content
import { AggregateRoot } from "../../Shared/Domain/AggregateRoot";

export interface PostProps {
  content: string;
  rating: number;
  hotelId: string;
  userId: string;
  createdAt: Date;
}

export class Post extends AggregateRoot<PostProps> {
  constructor(id: string, props: PostProps) {
    super(id);
    this.props = props;
  }
}
