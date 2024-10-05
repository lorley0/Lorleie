const express = require('express');
const { addCategory, fetchAllCategories } = require('../controllers/categoryController');

const router = express.Router();

// Register a new category
router.post('/', addCategory);

// Fetch all categories
router.get('/', fetchAllCategories);

module.exports = router;
