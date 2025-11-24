const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/api/categoryController');

router.get('/', ctrl.listCategories);

module.exports = router;
