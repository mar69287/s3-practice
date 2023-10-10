const express = require('express');
const router = express.Router();
const imagesCtrl = require('../../controllers/api/images');
const ensureLoggedIn = require('../../config/ensureLoggedIn');


router.post('/', imagesCtrl.create);
module.exports = router;