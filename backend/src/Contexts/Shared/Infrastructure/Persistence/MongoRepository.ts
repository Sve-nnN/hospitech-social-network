// Implementación base de repositorio Mongo genérico
export abstract class MongoRepository<T> {
  protected abstract model: any;

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).lean();
  }

  async save(entity: T): Promise<void> {
    await this.model.create(entity);
  }
}
