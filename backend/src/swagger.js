import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hospitech Social Network API',
      version: '1.0.0',
      description: 'API documentation for Hospitech social network (minimal)'
    },
    servers: [
      { url: process.env.SWAGGER_BASE_URL || 'http://localhost:3000' }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);
// Provide explicit path definitions, components and security to improve UI
const minimalPaths = {
  '/api/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Register a new user',
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthRegister' } } }
      },
      responses: {
        '201': { description: 'User created', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
        '400': { description: 'Validation error' }
      }
    }
  },
  '/api/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Log in and retrieve a JWT',
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthLogin' } } } },
      responses: { '200': { description: 'JWT token', content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } } } }, '401': { description: 'Unauthorized' } }
    }
  },
  '/api/users/{userId}': {
    get: {
      tags: ['Users'],
      summary: 'Get a public user profile',
      parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '200': { description: 'User object', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }, '404': { description: 'Not found' } }
    }
  },
  '/api/users/me': {
    get: {
      tags: ['Users'],
      summary: 'Get my profile',
      security: [{ bearerAuth: [] }],
      responses: { '200': { description: 'User object', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }, '401': { description: 'Unauthorized' } }
    },
    put: {
      tags: ['Users'],
      summary: 'Update my profile',
      security: [{ bearerAuth: [] }],
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UserUpdate' } } } },
      responses: { '200': { description: 'Updated user', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } } }
    },
    delete: {
      tags: ['Users'],
      summary: 'Delete my account',
      security: [{ bearerAuth: [] }],
      responses: { '204': { description: 'Deleted' }, '401': { description: 'Unauthorized' } }
    }
  },
  '/api/posts': {
    post: {
      tags: ['Posts'],
      summary: 'Create a new post (requires auth)',
      security: [{ bearerAuth: [] }],
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PostCreate' } } } },
      responses: { '201': { description: 'Post created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } }, '401': { description: 'Unauthorized' } }
    }
  },
  '/api/posts': {
    get: {
      tags: ['Posts'],
      summary: 'List posts (global feed)',
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        { name: 'user_id', in: 'query', schema: { type: 'string' } },
        { name: 'hotel_id', in: 'query', schema: { type: 'string' } },
        { name: 'min_rating', in: 'query', schema: { type: 'integer' } },
        { name: 'max_rating', in: 'query', schema: { type: 'integer' } },
        { name: 'sort', in: 'query', schema: { type: 'string' } }
      ],
      responses: { '200': { description: 'Paged posts', content: { 'application/json': { schema: { $ref: '#/components/schemas/PagedPosts' } } } } }
    }
  },
  '/api/posts/{id}': {
    get: {
      tags: ['Posts'],
      summary: 'Get a post by id',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '200': { description: 'Post', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } }, '404': { description: 'Not found' } }
    },
    put: {
      tags: ['Posts'],
      summary: 'Update a post',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PostUpdate' } } } },
      responses: { '200': { description: 'Updated post', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } }, '401': { description: 'Unauthorized' } }
    },
    delete: {
      tags: ['Posts'],
      summary: 'Delete a post',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '204': { description: 'Deleted' }, '401': { description: 'Unauthorized' } }
    }
  },
  '/api/hotels': {
    post: {
      tags: ['Hotels'],
      summary: 'Create a hotel',
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/HotelCreate' } } } },
      responses: { '201': { description: 'Hotel created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Hotel' } } } } }
    }
  },
  '/api/hotels': {
    get: {
      tags: ['Hotels'],
      summary: 'List hotels',
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        { name: 'city', in: 'query', schema: { type: 'string' } },
        { name: 'country', in: 'query', schema: { type: 'string' } },
        { name: 'min_rating', in: 'query', schema: { type: 'number' } }
      ],
      responses: { '200': { description: 'Paged hotels', content: { 'application/json': { schema: { $ref: '#/components/schemas/PagedHotels' } } } } }
    }
  },
  '/api/hotels/{id}': {
    get: {
      tags: ['Hotels'],
      summary: 'Get hotel details',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '200': { description: 'Hotel object', content: { 'application/json': { schema: { $ref: '#/components/schemas/Hotel' } } } }, '404': { description: 'Not found' } }
    },
    put: {
      tags: ['Hotels'],
      summary: 'Update a hotel',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/HotelCreate' } } } },
      responses: { '200': { description: 'Updated hotel', content: { 'application/json': { schema: { $ref: '#/components/schemas/Hotel' } } } } }
    },
    delete: {
      tags: ['Hotels'],
      summary: 'Delete a hotel',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '204': { description: 'Deleted' }, '401': { description: 'Unauthorized' } }
    }
  }
};

// Merge minimal paths into generated spec (without overwriting)
swaggerSpec.paths = { ...(swaggerSpec.paths || {}), ...minimalPaths };

// Add security scheme and common schemas
swaggerSpec.components = {
  ...(swaggerSpec.components || {}),
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  },
  schemas: {
    AuthRegister: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        nombre: { type: 'string' },
        apellido: { type: 'string' }
      },
      required: ['username', 'email', 'password']
    },
    AuthLogin: {
      type: 'object',
      properties: { email: { type: 'string' }, username: { type: 'string' }, password: { type: 'string' } }
    },
    TokenResponse: { type: 'object', properties: { token: { type: 'string' } } },
    User: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
        nombre: { type: 'string' },
        apellido: { type: 'string' },
        imagen_perfil_url: { type: 'string' }
      }
    },
    UserUpdate: {
      type: 'object',
      properties: {
        nombre: { type: 'string' },
        apellido: { type: 'string' },
        imagen_perfil_url: { type: 'string' },
        biografia: { type: 'string' },
        password: { type: 'string' }
      }
    },
    Post: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        contenido: { type: 'string' },
        rating: { type: 'number' },
        user_id: { type: 'string' },
        hotel_id: { type: 'string' },
        fecha_creacion: { type: 'string', format: 'date-time' },
        user_info: { type: 'object' },
        hotel_info: { type: 'object' }
      }
    },
    PostCreate: {
      type: 'object',
      properties: { contenido: { type: 'string' }, rating: { type: 'integer' }, hotel_id: { type: 'string' } },
      required: ['contenido', 'rating', 'hotel_id']
    },
    PostUpdate: { type: 'object', properties: { contenido: { type: 'string' }, rating: { type: 'integer' } } },
    Hotel: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        nombre: { type: 'string' },
        direccion: { type: 'object' },
        avg_rating: { type: 'number' },
        num_reviews: { type: 'number' }
      }
    },
    HotelCreate: {
      type: 'object',
      properties: { nombre: { type: 'string' }, direccion: { type: 'object' } },
      required: ['nombre', 'direccion']
    }
    ,
    PagedPosts: {
      type: 'object',
      properties: {
        page: { type: 'integer' },
        limit: { type: 'integer' },
        total: { type: 'integer' },
        posts: { type: 'array', items: { $ref: '#/components/schemas/Post' } }
      }
    },
    PagedHotels: {
      type: 'object',
      properties: {
        page: { type: 'integer' },
        limit: { type: 'integer' },
        total: { type: 'integer' },
        hotels: { type: 'array', items: { $ref: '#/components/schemas/Hotel' } }
      }
    }
  }
};

// Apply bearer auth requirement by default to relevant operations
const protectPaths = ['/api/posts', '/api/users/me', '/api/users/follow-user', '/api/users/follow-hotel'];
for (const p of protectPaths) {
  if (swaggerSpec.paths && swaggerSpec.paths[p] && swaggerSpec.paths[p].post) {
    swaggerSpec.paths[p].post.security = [{ bearerAuth: [] }];
  }
}

export const setupSwagger = (app) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
