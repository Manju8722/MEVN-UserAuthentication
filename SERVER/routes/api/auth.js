const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth');

const authController = require('../../controllers/authController');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.post('/refresh', authController.refresh);

router.get('/user', authMiddleware, authController.user);

module.exports = router;