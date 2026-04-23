const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');
const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/authenticate');
const upload = require('../../middleware/upload');
const schemas = require('./users.schema');

// All user routes require authentication
router.use(authenticate);

router.get('/profile', usersController.getProfile);
router.get('/search', usersController.searchUsers);
router.patch('/profile', validate(schemas.updateProfileSchema), usersController.updateProfile);
router.post('/profile/avatar', upload.single('avatar'), usersController.uploadAvatar);
router.patch('/password', validate(schemas.updatePasswordSchema), usersController.updatePassword);
router.delete('/account', usersController.deleteAccount);

module.exports = router;
