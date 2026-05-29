const express = require('express');
const { body } = require('express-validator');
const { createEnquiry, getAgentEnquiries } = require('../controllers/enquiryController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/agent', protect, authorizeRoles('agent'), getAgentEnquiries);

router.post(
  '/',
  [
    body('propertyId').notEmpty().withMessage('propertyId is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('message').isLength({ min: 5 }).withMessage('Message should be at least 5 chars'),
    validate
  ],
  createEnquiry
);

module.exports = router;
