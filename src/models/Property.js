const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    bhk: { type: Number, required: true, min: 1 },
    location: { type: String, required: true, trim: true, index: true },
    images: [{ type: String }],
    propertyType: {
      type: String,
      enum: ['Apartment', 'Villa', 'Independent House', 'Studio', 'Plot'],
      required: true
    },
    area: { type: Number, required: true, min: 1 },
    contactDetails: {
      phone: { type: String, required: true },
      email: { type: String, required: true }
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
