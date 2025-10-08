// 📁 routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// 🔐 রোল CRUD API
router.get('/roles', roleController.getAllRoles);
router.post('/roles', roleController.createRole);

module.exports = router;
