const QuizTemplate = require('../models/quizTemplate');

//return live quizzes
exports.index = function (req, res) {
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