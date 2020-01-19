const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizResponseSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    template: { type: Schema.Types.ObjectId, ref: 'QuizTemplate', required: true },
    answers: [Number],
    score: Number
  }
)

module.exports = mongoose.model('QuizResponse', QuizResponseSchema);