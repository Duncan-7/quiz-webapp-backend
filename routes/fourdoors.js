var express = require('express');
var router = express.Router();
const withAuth = require('../middleware/auth');
const fourdoorsController = require('../controllers/fourdoorsController')

router.post('/', withAuth, fourdoorsController.createPlaythrough);

router.post('/:id', withAuth, fourdoorsController.updatePlaythrough);

router.post('/game/:id', withAuth, fourdoorsController.playRound);

router.post('/game/:id/nextround', withAuth, fourdoorsController.nextRound);

router.post('/game/:id/cashout', withAuth, fourdoorsController.cashOut);

module.exports = router;