// Caso de uso: Crear Post
import { Post } from "../../Domain/Post";

export class CreatePost {
  async execute(data: any): Promise<Post> {
    // lógica de validación y creación
    const post = new Post(data.id, data);
    // guardar post y publicar evento...
    return post;
  }
}
