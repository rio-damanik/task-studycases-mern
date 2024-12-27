const router = require('express').Router();
const multer = require('multer');
const passport = require('passport');
const { me, updateProfile } = require('./controller');

router.get('/me', me);
router.put('/profile', updateProfile);

module.exports = router;
