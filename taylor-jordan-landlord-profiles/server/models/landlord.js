const mongoose = require('mongoose');

const landlordSchema = new mongoose.Schema({
  landlordName: { type: String, required: true, minlength: 2 },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  propertiesOwned: { type: Number, required: true, min: 0 },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isArchived: { type: Boolean, default: false }
});

module.exports = mongoose.model('Landlord', landlordSchema, 'Landlords');