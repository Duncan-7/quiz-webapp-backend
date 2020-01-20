const QuizResponse = require('../models/quizResponse');
const QuizTemplate = require('../models/quizTemplate');
const User = require('../models/user');


//return all user's quizzes
exports.index = function (req, res) {
  QuizResponse.find({}, function (err, responses) {
    if (err) {
      res.status(500)
        .json({ error: "couldn't find reponses" });
    } else {
      console.log(templates)
      res.status(200)
        .json({
          quizResponses: reponses
        });
    }
  });
}

//create new response
exports.create = function (req, res) {
  const userId = req.body.userId;
  const templateId = req.body.templateId;
  const answers = req.body.answers

  const quizResponse = new QuizResponse({
    user: userId,
    template: templateId,
    answers: answers,
    incomplete: true,
    score: null
  });

  QuizTemplate.findById(templateId, function (err, template) {
    if (err) {
      res.status(500)
        .json({
          err: "Cannot find quiz template"
        });
    } else {
      if (template.questions.length === quizResponse.answers.length) {
        quizResponse.incomplete = false;
      };

      quizResponse.save(function (err, quizResponse) {
        if (err) {
          res.status(500)
            .json({
              error: err
            });
        } else {
          res.send("answers saved");
        }
      });
    }
  });
}