function chatPage(req, res) {
  res.render('chat', { user: { id: req.session.userId, role: req.session.userRole, username: req.session.username } });
}

module.exports = { chatPage };
