
 // Lucía Gómez Muñoz - 20/11/2026
function errorHandler(err, req, res, next) {
  const status = err.status || 500;

  res.status(status).json({
    error: status === 500
      ? 'Error interno del servidor'
      : err.message
  });
}

module.exports = errorHandler;
