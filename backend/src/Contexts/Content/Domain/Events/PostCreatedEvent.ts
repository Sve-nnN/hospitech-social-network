// Evento de dominio: Post creado
export class PostCreatedEvent {
  constructor(public readonly postId: string) {}
}
