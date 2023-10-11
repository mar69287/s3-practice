const express = require('express');
const router = express.Router();
const profilesCtrl = require('../../controllers/api/profiles');
const ensureLoggedIn = require('../../config/ensureLoggedIn');


router.post('/create', profilesCtrl.create);
router.get('/', ensureLoggedIn, profilesCtrl.show);
module.exports = router;