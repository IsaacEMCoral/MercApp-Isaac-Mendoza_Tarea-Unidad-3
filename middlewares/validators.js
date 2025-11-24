const { body } = require('express-validator');

const registerValidator = [
  body('username').isLength({ min: 3 }).withMessage('Usuario mínimo 3 caracteres'),
  body('password').isLength({ min: 6 }).withMessage('Password mínimo 6 caracteres')
];

const productValidator = [
  body('name').notEmpty().withMessage('Nombre requerido'),
  body('sku').notEmpty().withMessage('SKU requerido'),
  body('price').isFloat({ min: 0 }).withMessage('Precio inválido'),
  body('quantity').isInt({ min: 0 }).withMessage('Cantidad inválida')
];

module.exports = { registerValidator, productValidator };
