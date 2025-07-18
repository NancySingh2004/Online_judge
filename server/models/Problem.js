const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  inputFormat: String,
  outputFormat: String,
  sampleInput: String,
  sampleOutput: String,
  constraints: String,
  testCases: [
    {
      input: String,
      output: String,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
