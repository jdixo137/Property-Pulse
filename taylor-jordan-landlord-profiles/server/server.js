const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const landlordRoutes = require('./routes/landlords');
const propertyRoutes = require('./routes/properties');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/PropertyPulse')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/landlords', landlordRoutes);
app.use('/properties', propertyRoutes);

app.listen(8000, () => console.log('Server running on http://localhost:8000'));