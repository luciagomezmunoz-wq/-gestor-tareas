
 // Lucía Gómez Muñoz - 20/11/2026
const knex = require('knex');
const configuraciones = require('../../knexfile');

const entorno = process.env.NODE_ENV || 'development';

const db = knex(configuraciones[entorno]);

module.exports = db;
