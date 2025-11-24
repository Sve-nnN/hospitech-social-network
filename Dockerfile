FROM node:18-alpine

# Creamos carpeta de la app
WORKDIR /app

# Instalamos dependencias
COPY package*.json ./
RUN npm install --production

# Contruimos la aplicación
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/index.js"]

