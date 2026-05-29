const express = require('express');
const { body } = require('express-validator');
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyListings
} = require('../controllers/propertyController');
const { uploadPropertyImages } = require('../controllers/uploadController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

const propertyValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be valid'),
  body('bhk').isInt({ min: 1 }).withMessage('BHK must be at least 1'),
  body('location').notEmpty().withMessage('Location is required'),
  body('propertyType').isIn(['Apartment', 'Villa', 'Independent House', 'Studio', 'Plot']),
  body('area').isFloat({ min: 1 }).withMessage('Area must be valid'),
  body('contactDetails.phone').notEmpty().withMessage('Phone is required'),
  body('contactDetails.email').isEmail().withMessage('Valid contact email is required'),
  validate
];

router.get('/', getProperties);
router.get('/my/listings', protect, authorizeRoles('agent'), getMyListings);
router.post(
  '/upload',
  protect,
  authorizeRoles('agent'),
  upload.array('images', 3),
  uploadPropertyImages
);
router.get('/:id', getPropertyById);
router.post('/', protect, authorizeRoles('agent'), propertyValidation, createProperty);
router.put('/:id', protect, authorizeRoles('agent'), propertyValidation, updateProperty);
router.delete('/:id', protect, authorizeRoles('agent'), deleteProperty);

module.exports = router;
