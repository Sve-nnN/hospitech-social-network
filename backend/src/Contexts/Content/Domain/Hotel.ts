// Entidad Hotel para Content
import { AggregateRoot } from "../../Shared/Domain/AggregateRoot";

export interface HotelProps {
  name: string;
  address: string;
  avgRating: number;
  reviewCount: number;
}

export class Hotel extends AggregateRoot<HotelProps> {
  constructor(id: string, props: HotelProps) {
    super(id);
    this.props = props;
  }
}
