function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.redirect('/auth/login');
}

function ensureAdmin(req, res, next) {
  if (req.session && req.session.userRole === 'admin') return next();
  return res.status(403).send('Acceso denegado');
}

module.exports = { ensureAuthenticated, ensureAdmin };
