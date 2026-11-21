
 // Lucía Gómez Muñoz - 20/11/2026
const bcrypt = require('bcrypt');

// Cifrar una contraseña
async function cifrarPassword(password) {
  return await bcrypt.hash(password, 12);
}

// Comprobar una contraseña
async function comprobarPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = {
  cifrarPassword,
  comprobarPassword
};
