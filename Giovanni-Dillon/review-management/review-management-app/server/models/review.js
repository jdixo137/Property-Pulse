const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  propertyId: { type: String, required: true },
  username: { type: String, required: true },
  overallRating: { type: Number, required: true, min: 1, max: 5 },
  maintenanceRating: { type: Number, required: true, min: 1, max: 5 },
  communicationRating: { type: Number, required: true, min: 1, max: 5 },
  conditionRating: { type: Number, required: true, min: 1, max: 5 },
  valueRating: { type: Number, required: true, min: 1, max: 5 },
  moveRating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true, minlength: 10 },
  submissionDate: { type: String, default: () => new Date().toLocaleDateString() }
});

module.exports = mongoose.model('Review', reviewSchema, 'Reviews');