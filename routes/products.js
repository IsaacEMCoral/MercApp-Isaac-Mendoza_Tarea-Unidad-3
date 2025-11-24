const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/productController');
const multer = require('multer');
const path = require('path');
const { productValidator } = require('../middlewares/validators');
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/auth');

const storage = multer.diskStorage({
  destination: function(req,file,cb){ cb(null, path.join(__dirname,'..','public','uploads')); },
  filename: function(req,file,cb){ cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g,'_')); }
});
const upload = multer({ storage });

router.use(ensureAuthenticated);

router.get('/', productCtrl.listProducts);
router.get('/create', ensureAdmin, productCtrl.showCreateForm);
router.post('/create', ensureAdmin, upload.single('image'), productValidator, productCtrl.createProduct);

router.get('/:id', productCtrl.viewProduct);
router.get('/:id/edit', ensureAdmin, productCtrl.showEditForm);
router.post('/:id/edit', ensureAdmin, upload.single('image'), productValidator, productCtrl.updateProduct);
router.post('/:id/delete', ensureAdmin, productCtrl.deleteProduct);

module.exports = router;
