
 // Lucía Gómez Muñoz - 20/11/2026
const app = require('./app');
const config = require('./config/env');

const server = app.listen(config.port, () => {
  console.log(`Servidor funcionando en http://localhost:${config.port}`);
});

server.on('error', (error) => {
  console.error('Error al iniciar el servidor:', error.message);
});
