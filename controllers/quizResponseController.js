const QuizResponse = require('../models/quizResponse');
const QuizTemplate = require('../models/quizTemplate');
const User = require('../models/user');
const async = require('async');

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
    complete: false,
    score: null
  });
  //check that the template and user for this response submission exists, 
  //and that the user hasn't already entered this quiz
  async.parallel({
    template: function (callback) {
      QuizTemplate.findById(templateId, callback);
    },
    pastResponse: function (callback) {
      QuizResponse.find({ user: userId, template: templateId }, callback);
    },
    user: function (callback) {
      User.findById(userId, callback);
    },
  }, function (err, results) {
    console.log("test")
    console.log(results)
    if (err) {
      res.status(500)
        .json({
          error: err
        });
    } else if (results.pastResponse.length !== 0) {
      res.status(500)
        .json({
          error: "You have already submitted a response for this quiz"
        });
    } else {
      if (results.template.questions.length === quizResponse.answers.length) {
        quizResponse.complete = true;
      };

      quizResponse.save(function (err, quizResponse) {
        if (err) {
          res.status(500)
            .json({
              error: err
            });
        } else {
          res.json({
            quizResponse: quizResponse
          });
        }
      })
    }
  })
}

//update a response
exports.update = function (req, res) {
  QuizResponse.findById(req.params.id)
    .populate('template')
    .exec(function (err, quizResponse) {
      quizResponse.answers = req.body.answers;
      if (quizResponse.template.questions.length === quizResponse.answers.length) {
        quizResponse.complete = true;
      }
      quizResponse.save(function (err) {
        if (err) {
          res.status(500)
            .json({
              error: err
            });
        } else {
          res.send("response updated")
        }
      })
    });
}

//delete template
exports.destroy = function (req, res) {
  QuizResponse.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err);
      res.status(500)
        .json({
          error: err
        });
    } else {
      res.send("response deleted");
    }
  })
}