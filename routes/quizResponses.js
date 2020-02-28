const express = require('express');
const router = express.Router();
const withAuth = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');
const QuizTemplate = require('../models/quizTemplate');
const quizResponseController = require('../controllers/quizResponseController');

// get all quizzes for a user
router.get('/', quizResponseController.index)

//create new quiz template
router.post('/', quizResponseController.create);

//update quiz template
router.put('/:id', quizResponseController.update);

//delete quiz template
router.delete('/:id', quizResponseController.destroy);

module.exports = router;