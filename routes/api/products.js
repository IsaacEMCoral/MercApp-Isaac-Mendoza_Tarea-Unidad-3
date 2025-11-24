const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/api/productController');

router.get('/', ctrl.listProducts);
router.get('/:id', ctrl.getProduct);
router.post('/', ctrl.createProduct);
router.put('/:id', ctrl.updateProduct);
router.patch('/:id', ctrl.updateProduct);
router.delete('/:id', ctrl.deleteProduct);

module.exports = router;
