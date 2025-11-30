// Repositorio de hoteles usando MongoDB (ejemplo base)
import { MongoRepository } from "../../../Shared/Infrastructure/Persistence/MongoRepository";
import { Hotel } from "../../Domain/Hotel";

export class HotelMongoRepository extends MongoRepository<Hotel> {
  protected model: any; // Aquí iría el modelo de Mongoose
}
