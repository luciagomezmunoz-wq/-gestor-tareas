
# Gestor de tareas por equipos

Proyecto desarrollado por Lucía Gómez Muñoz.

## 1. Descripción

Esta aplicación permite gestionar tareas organizadas por equipos.

Se ha desarrollado utilizando Node.js y Express, con una base de datos SQLite y Knex.js para realizar las consultas.

Los usuarios pueden registrarse, iniciar sesión y consultar las tareas de los equipos a los que pertenecen.

Los administradores disponen de permisos adicionales para gestionar equipos, añadir miembros y consultar los usuarios registrados.

## 2. Tecnologías utilizadas

- Node.js
- Express
- JavaScript
- SQLite
- Knex.js
- JWT
- bcrypt
- Helmet
- CORS
- express-rate-limit

## 3. Instalación

Para instalar y ejecutar el proyecto:

1. Descargar el repositorio.
2. Abrir una terminal dentro de la carpeta backend.
3. Instalar las dependencias:

    npm install

4. Crear un archivo .env a partir de .env.example.
5. Configurar las variables de entorno.
6. Ejecutar las migraciones:

    npx knex migrate:latest

7. Cargar los datos de prueba:

    npx knex seed:run

8. Iniciar el servidor:

    npm run dev

El servidor se ejecuta en:

http://localhost:3000

## 4. Variables de entorno

El archivo .env debe contener las siguientes variables:

PORT=3000
NODE_ENV=development
DB_FILENAME=./database.sqlite
JWT_SECRET=establecer_una_clave_secreta_segura

El archivo .env no debe publicarse en GitHub.

## 5. Autenticación

La aplicación utiliza tokens JWT para identificar a los usuarios.

Para acceder a las rutas protegidas, hay que iniciar sesión y enviar el token en la cabecera Authorization.

Existen dos roles:

- miembro: puede acceder a los equipos a los que pertenece y gestionar sus tareas.
- admin: dispone de permisos adicionales para gestionar equipos y consultar usuarios.

## 6. Endpoints de la aplicación

### Autenticación

POST /api/auth/register
Registrar un usuario.

POST /api/auth/login
Iniciar sesión y obtener un token JWT.

### Equipos

GET /api/teams
Consultar los equipos.

GET /api/teams/:id
Consultar un equipo por su identificador.

GET /api/teams/mis-equipos
Consultar los equipos del usuario identificado.

GET /api/teams/todos
Consultar todos los equipos como administrador.

POST /api/teams
Crear un equipo.

POST /api/teams/nuevo
Crear un equipo como administrador.

POST /api/teams/:teamId/miembros
Añadir un usuario a un equipo como administrador.

DELETE /api/teams/:id
Eliminar un equipo.

### Tareas

GET /api/tasks
Consultar las tareas permitidas.

GET /api/tasks/:id
Consultar una tarea.

POST /api/tasks
Crear y asignar una tarea.

PUT /api/tasks/:id
Actualizar una tarea.

PATCH /api/tasks/:id
Modificar parcialmente una tarea.

DELETE /api/tasks/:id
Eliminar una tarea.

GET /api/tasks/estadisticas/:teamId
Consultar las estadísticas de tareas de un equipo.

### Administración

GET /api/admin
Comprobar el acceso como administrador.

GET /api/admin/usuarios
Consultar los usuarios registrados. Solo administradores.

## 7. Seguridad

Se han aplicado diferentes medidas de seguridad:

- Contraseñas cifradas mediante bcrypt.
- Autenticación con JWT.
- Control de permisos según el rol.
- Comprobación de pertenencia a los equipos.
- Cabeceras de seguridad mediante Helmet.
- Configuración de CORS.
- Límite de 10 KB para las peticiones JSON.
- Límite de cinco intentos de login cada quince minutos.

## 8. Pruebas

Las pruebas de las rutas se han realizado utilizando REST Client en Visual Studio Code.

Se han comprobado operaciones como:

- Registro e inicio de sesión.
- Acceso permitido y denegado según los permisos.
- Consulta y creación de equipos.
- Creación y asignación de tareas.
- Actualización del estado de una tarea.
- Eliminación de tareas.
- Consulta de estadísticas.
- Listado de usuarios para administradores.
- Respuestas HTTP correctas y errores 401, 403 y 404.

## 9. Conclusión

Con este proyecto he aprendido a desarrollar una API REST utilizando Node.js y Express, trabajar con una base de datos SQLite y controlar el acceso de los usuarios mediante autenticación y permisos.

También he podido comprobar el funcionamiento de las diferentes rutas y aplicar medidas básicas de seguridad.
