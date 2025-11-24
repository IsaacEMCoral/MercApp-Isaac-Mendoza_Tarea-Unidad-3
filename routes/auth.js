const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const { registerValidator } = require('../middlewares/validators');
const { validationResult } = require('express-validator');

router.get('/register', authCtrl.getRegister);
router.post('/register', registerValidator, (req,res,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.render('register', { errors: errors.array(), old: req.body });
  next();
}, authCtrl.postRegister);

router.get('/login', authCtrl.getLogin);
router.post('/login', authCtrl.postLogin);

router.post('/logout', authCtrl.logout);

module.exports = router;
