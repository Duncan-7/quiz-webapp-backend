const express = require('express');
const router = express.Router();
const withAuth = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');
const QuizTemplate = require('../models/quizTemplate');
const quizTemplateController = require('../controllers/quizTemplateController');

// get all quizzes
router.get('/', quizTemplateController.index)

//get all live quizzes
router.get('/live', quizTemplateController.liveIndex);

//create new quiz template
router.post('/', checkAdmin, quizTemplateController.create);

//update quiz template
router.put('/:id', checkAdmin, quizTemplateController.update);

//delete quiz template
router.delete('/:id', checkAdmin, quizTemplateController.destroy);

module.exports = router;