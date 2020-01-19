const express = require('express');
const router = express.Router();
const withAuth = require('../auth');
const QuizTemplate = require('../models/quizTemplate');
const quizTemplatesController = require('../controllers/quizTemplateController');

//get all live quizzes
router.get('/', quizTemplatesController.index);

module.exports = router;