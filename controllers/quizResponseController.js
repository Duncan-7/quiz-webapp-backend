const QuizResponse = require('../models/quizResponse');
const QuizTemplate = require('../models/quizTemplate');
const User = require('../models/user');
const async = require('async');

//return all user's quizzes
exports.index = function (req, res) {
  const userId = req.query.id;
  QuizResponse.find({ user: userId }, function (err, responses) {
    if (err) {
      res.status(500)
        .json({ error: "Couldn't find reponses" });
    } else {
      res.status(200)
        .json({
          quizResponses: responses
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
    score: null,
    resultsViewed: false,
    archived: false
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
    .exec(function (err, quizResponse) {
      //update resultsViewed if present in incoming request
      if (req.body.resultsViewed !== undefined) {
        quizResponse.resultsViewed = req.body.resultsViewed;
        //update user balance with any earned coins when results are viewed
        User.findById(quizResponse.user)
          .exec(function (err, user) {
            if (err) {
              res.status(500)
                .json({
                  error: "Couldn't find user"
                });
            } else {
              user.balance = user.balance + quizResponse.score * 50;
              user.save(function (err) {
                if (err) {
                  res.status(500)
                    .json({
                      error: "Couldn't update user balance"
                    });
                } else {
                  console.log("balance updated", user.balance);
                }
              })
            }
          })
      }
      //update archived if present in req body
      if (req.body.archived !== undefined) {
        quizResponse.archived = req.body.archived;
      }
      quizResponse.save(function (err, updatedQuizResponse) {
        if (err) {
          res.status(500)
            .json({
              error: err
            });
        } else {
          res.json({
            quizResponse: updatedQuizResponse
          });
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