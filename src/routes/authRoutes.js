const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/register',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 80 })
      .withMessage('Name must be between 2 and 80 characters'),
    body('email')
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
    body('role')
      .trim()
      .toLowerCase()
      .isIn(['agent', 'home_seeker'])
      .withMessage('Role must be agent or home_seeker'),
    validate
  ],
  register
);

router.post(
  '/login',
  [
    body('email').trim().normalizeEmail().isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  login
);

module.exports = router;
