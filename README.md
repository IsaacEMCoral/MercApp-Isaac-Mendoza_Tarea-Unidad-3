# MercApp Isaac Mendoza Tarea Unidad 3
# MercApp — Instrucciones mínimas de uso.

Requisitos:
- Node.js
- MongoDB
- VS Code

# Inicializar en MongoDB Compass la conexion.

1. Configurar variables backend:
En el archivo ".env" tener necesariamente lo siguiente
PORT=3000
MONGO_URI=mongodb://localhost:27017/miinventario
SESSION_SECRET=tu_secreto
BASE_URL=http://localhost:5173

2. Instalar dependencias backend:
En la carpeta principal ejecutar los siguientes comandos en Windows Power Shell
npm install
npm run seed

3. Ejecutar backend:
Nuevamente desde la carpeta principal ejecutar en Wondows Power Shell
node server.js

4. Ejecutar frontend
Abrir Windows Powers Shell en la carpeta "frontend" y ejecutar
npm run dev

# Importante: 
Ejecutar npm install en la carpeta correcta
