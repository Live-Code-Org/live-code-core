const express = require('express');
const router = express.Router();
const {getUserProfile, updateUserProfile} = require('../controllers/userController');





router.get('/:githubHandle', getUserProfile);

router.put('/:githubHandle', updateUserProfile);

module.exports = router;