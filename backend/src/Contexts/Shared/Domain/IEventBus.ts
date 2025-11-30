// Contrato para EventBus
export interface IEventBus {
  publish(events: any[]): Promise<void>;
}
