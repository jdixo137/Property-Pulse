const express = require('express');
const router = express.Router();
const Landlord = require('../models/landlord');

// READ: get all landlords
router.get('/', async (req, res) => {
  try {
    const landlords = await Landlord.find();
    res.json(landlords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE: add a landlord
router.post('/', async (req, res) => {
  try {
    const landlord = new Landlord(req.body);
    const saved = await landlord.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE: edit, archive (soft delete) or restore a landlord
router.put('/:id', async (req, res) => {
  try {
    const updated = await Landlord.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Landlord not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;