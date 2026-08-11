const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }, 
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },

  inputFormat: { type: String },
  outputFormat: { type: String },
  sampleInput: { type: String },
  sampleOutput: { type: String },
  constraints: { type: String },

  testCases: [
    {
      input: { type: String, required: true },
      expectedOutput: { type: String, required: true }, 
      hidden: {
        type: Boolean,
        default: false
      }
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
