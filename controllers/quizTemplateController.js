const QuizTemplate = require('../models/quizTemplate');
const QuizResponse = require('../models/quizResponse');
const User = require('../models/user');

//return all quizzes
exports.index = function (req, res) {
  QuizTemplate.find({}, 'title closingDate', function (err, templates) {
    if (err) {
      console.log(err)
      res.status(500)
        .json({ error: "couldn't find records" });
    } else {
      console.log(templates)
      res.status(200)
        .json({
          quizTemplates: templates
        });
    }
  });
}

//return live quizzes
exports.liveIndex = function (req, res) {
  QuizTemplate.find({ live: true }, 'title closingDate', function (err, templates) {
    if (err) {
      console.log(err)
      res.status(500)
        .json({ error: "couldn't find records" });
    } else {
      console.log(templates)
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

  QuizTemplate.findByIdAndUpdate(req.params.id, quizTemplate, {}, function (err, quizTemplate) {
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