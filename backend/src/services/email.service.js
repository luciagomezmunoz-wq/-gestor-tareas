
 // Lucía Gómez Muñoz - 20/11/2026

// Servicio de correo simulado
async function enviarEmail(destinatario, asunto, mensaje) {
  console.log('----- EMAIL SIMULADO -----');
  console.log('Para:', destinatario);
  console.log('Asunto:', asunto);
  console.log('Mensaje:', mensaje);
  console.log('-------------------------');

  return true;
}

module.exports = { enviarEmail };
