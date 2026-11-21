
// Lucía Gómez Muñoz - 20/11/2026
function validate(schema) {
  return (req, res, next) => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        error: 'Datos incorrectos',
        campos: resultado.error.issues.map((issue) => ({
          campo: issue.path.join('.'),
          mensaje: issue.message
        }))
      });
    }

    req.body = resultado.data;
    next();
  };
}

module.exports = validate;
