const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/authenticate');
const rateLimiter = require('../../middleware/rateLimiter');
const schemas = require('./auth.schema');

router.post('/register', rateLimiter('auth'), validate(schemas.registerSchema), authController.register);
router.post('/login', rateLimiter('auth'), validate(schemas.loginSchema), authController.login);
router.post('/google-login', rateLimiter('auth'), authController.googleLogin);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
