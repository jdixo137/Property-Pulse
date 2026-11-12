const mongoose = require('mongoose');

// Property Listings (Jasmine Dixon)
// Fields match the Add Property reactive form. isArchived is the soft delete.
const propertySchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true, match: /^\d{5}$/ },
  propertyType: { type: String, required: true },
  rentPrice: { type: Number, required: true, min: 100 },
  beds: { type: Number, required: true },
  baths: { type: Number, required: true },
  amenities: {
    dishwasher: { type: Boolean, default: false },
    basement: { type: Boolean, default: false },
    fireplace: { type: Boolean, default: false },
    laundry: { type: Boolean, default: false },
    closet: { type: Boolean, default: false },
    hardwood: { type: Boolean, default: false },
    pool: { type: Boolean, default: false },
    porch: { type: Boolean, default: false },
    deck: { type: Boolean, default: false },
    gated: { type: Boolean, default: false },
    playground: { type: Boolean, default: false }
  },
  // Links each property to a landlord from Taylor's Landlords collection
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'Landlord', required: true },
  isArchived: { type: Boolean, default: false }
});

module.exports = mongoose.model('Property', propertySchema, 'Properties');
