// Implementación simple de EventBus en memoria
import { IEventBus } from "../Domain/IEventBus";

export class InMemoryEventBus implements IEventBus {
  async publish(events: any[]): Promise<void> {
    for (const event of events) {
      // Aquí se podría loggear o manejar listeners
      console.log("Evento publicado:", event);
    }
  }
}
