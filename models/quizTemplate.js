const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    question: String,
    answerOptions: [String],
    answerIndex: Number
  }
)

const QuizTemplateSchema = new Schema(
  {
    title: { type: String, required: true, max: 50 },
    closingDate: Date,
    live: Boolean,
    results: Boolean,
    questions: [questionSchema]
  }
)




module.exports = mongoose.model('QuizTemplate', QuizTemplateSchema);