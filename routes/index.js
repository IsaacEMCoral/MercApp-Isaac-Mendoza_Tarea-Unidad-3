const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const chatCtrl = require('../controllers/chatController');

router.get('/', ensureAuthenticated, (req,res)=>res.render('index', { user: { username: req.session.username, role: req.session.userRole } }));
router.get('/chat', ensureAuthenticated, chatCtrl.chatPage);

module.exports = router;
