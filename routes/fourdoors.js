var express = require('express');
var router = express.Router();
const withAuth = require('../middleware/auth');
const fourdoorsController = require('../controllers/fourdoorsController')

router.post('/', fourdoorsController.createPlaythrough);

router.post('/:id', fourdoorsController.updatePlaythrough);

router.post('/game/:id', fourdoorsController.playRound);

router.post('/game/:id/nextround', fourdoorsController.nextRound);

router.post('/game/:id/cashout', fourdoorsController.cashOut);

module.exports = router;