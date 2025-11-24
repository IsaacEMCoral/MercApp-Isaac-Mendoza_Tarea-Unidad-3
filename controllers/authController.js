const User = require('../models/User');
const bcrypt = require('bcrypt');

const saltRounds = 10;

async function getRegister(req, res) {
  res.render('register', { errors: [], old: {} });
}

async function postRegister(req, res) {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.render('register', { errors: [{ msg: 'Usuario ya existe' }], old: req.body });
    }
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({ username, passwordHash, role: 'admin' }); // primer usuario admin
    await user.save();
    req.session.userId = user._id;
    req.session.userRole = user.role;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('register', { errors: [{ msg: 'Error registrando' }], old: req.body });
  }
}

async function getLogin(req, res) {
  res.render('login', { errors: [], old: {} });
}

async function postLogin(req, res) {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.render('login', { errors: [{ msg: 'Usuario o contraseña inválidos' }], old: req.body });
    const ok = await user.verifyPassword(password);
    if (!ok) return res.render('login', { errors: [{ msg: 'Usuario o contraseña inválidos' }], old: req.body });
    req.session.userId = user._id;
    req.session.userRole = user.role;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('login', { errors: [{ msg: 'Error durante login' }], old: req.body });
  }
}

function logout(req, res) {
  req.session.destroy(() => res.redirect('/auth/login'));
}

module.exports = { getRegister, postRegister, getLogin, postLogin, logout };
