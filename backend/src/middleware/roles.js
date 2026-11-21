
// Lucía Gómez Muñoz - 20/11/2026

function permitirRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        error: 'Usuario no autenticado'
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        error: 'No tienes permiso para acceder'
      });
    }

    next();
  };
}

module.exports = permitirRoles;
