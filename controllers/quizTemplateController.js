const QuizTemplate = require('../models/quizTemplate');
const QuizResponse = require('../models/quizResponse');
const User = require('../models/user');

//return all quizzes
exports.index = function (req, res) {
  QuizTemplate.find({}, function (err, templates) {
    if (err) {
      res.status(500)
        .json({ error: "couldn't find records" });
    } else {
      res.status(200)
        .json({
          quizTemplates: templates
        });
    }
  });
}

//return live quizzes
exports.liveIndex = function (req, res) {
  QuizTemplate.find({ live: true }, function (err, templates) {
    if (err) {
      res.status(500)
        .json({ error: "couldn't find records" });
    } else {
      res.status(200)
        .json({
          quizTemplates: templates
        });
    }
  });
}

//create new template
exports.create = function (req, res) {
  const title = req.body.title;
  const closingDate = req.body.closingDate;
  const questions = req.body.questions;
  const quizTemplate = new QuizTemplate({
    title: title,
    closingDate: closingDate,
    live: true,
    results: false,
    questions: questions
  });

  quizTemplate.save(function (err, quizTemplate) {
    if (err) {
      console.log(err);
      res.status(500)
        .json({
          error: err
        });
    } else {
      res.json({
        quizTemplate: quizTemplate
      })
    }
  });
}

//update template
exports.update = function (req, res) {
  const title = req.body.title;
  const closingDate = req.body.closingDate;
  const questions = req.body.questions;
  const quizTemplate = new QuizTemplate({
    _id: req.params.id,
    title: title,
    closingDate: closingDate,
    live: req.body.live,
    results: req.body.results,
    questions: questions
  });

  //make sure results are all present before updating quiz responses
  answersComplete = true;
  quizTemplate.questions.forEach(question => {
    if (question.answerIndex == null) {
      answersComplete = false;
    };
  });

  if (!answersComplete) {
    quizTemplate.results = false;
  }
  console.log(quizTemplate.results)

  QuizTemplate.findByIdAndUpdate(req.params.id, quizTemplate, {}, function (err, quizTemplate) {
    if (err) {
      console.log(err);
      res.status(500)
        .json({
          error: err
        });
    } else {
      //check whether results are complete, and if so update quiz responses for this template
      if (quizTemplate.results) {
        QuizResponse.find({ template: quizTemplate._id }, function (err, responses) {
          if (err) {
            res.status(500)
              .json({
                error: err
              });
          } else {
            responses.forEach(response => {
              score = 0;
              response.answers.forEach((answer, index) => {
                if (answer == quizTemplate.questions[index].answerIndex) {
                  score++;
                }
              });
              updatedResponse = new QuizResponse({
                _id: response._id,
                answers: response.answers,
                user: response.user,
                template: response.template,
                complete: response.complete,
                score: score
              })
              QuizResponse.findByIdAndUpdate(response._id, updatedResponse, {}, function (err, newResponse) {
                if (err) {
                  console.log(err);
                } else {
                  console.log(newResponse);
                }
              })
            })
          }
        })
      }
      //finish update request
      res.json({
        quizTemplate: quizTemplate
      })
    }
  });

}

//delete template
exports.destroy = function (req, res) {
  QuizTemplate.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err);
      res.status(500)
        .json({
          error: err
        });
    } else {
      res.send("template deleted")
    }
  })
}