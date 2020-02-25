const express = require('express');
const router = express.Router();
const withAuth = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');
const QuizTemplate = require('../models/quizTemplate');
const quizTemplateController = require('../controllers/quizTemplateController');

// get all quizzes
router.get('/', withAuth, quizTemplateController.index)

//get all live quizzes
router.get('/live', withAuth, quizTemplateController.liveIndex);

//create new quiz template
router.post('/', withAuth, checkAdmin, quizTemplateController.create);

//update quiz template
router.put('/:id', withAuth, checkAdmin, quizTemplateController.update);

//delete quiz template
router.delete('/:id', withAuth, checkAdmin, quizTemplateController.destroy);

module.exports = router;