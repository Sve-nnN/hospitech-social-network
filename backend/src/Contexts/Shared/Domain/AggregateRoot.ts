// Clase base para AggregateRoot en DDD
export abstract class AggregateRoot<T> {
  public readonly id: string;
  private domainEvents: any[] = [];

  constructor(id: string) {
    this.id = id;
  }

  protected addDomainEvent(event: any): void {
    this.domainEvents.push(event);
  }

  public pullDomainEvents(): any[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }
}
