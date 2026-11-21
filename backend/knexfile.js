
 // Lucía Gómez Muñoz - 20/11/2026
require('dotenv').config();

const path = require('path');

const crearConexion = (archivo) => ({
  client: 'better-sqlite3',
  connection: {
    filename: path.join(__dirname, archivo)
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, 'migrations')
  },
  seeds: {
    directory: path.join(__dirname, 'seeds')
  }
});

module.exports = {
  development: crearConexion(
    process.env.DB_FILENAME || './database.sqlite'
  ),
  test: crearConexion('./database.test.sqlite'),
  production: crearConexion(
    process.env.DB_FILENAME || './database.production.sqlite'
  )
};
