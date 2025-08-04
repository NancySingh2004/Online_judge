const Problem = require('../models/Problem');

exports.createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      inputFormat,
      outputFormat,
      sampleInput,
      sampleOutput,
      constraints,
      testCases
    } = req.body;

    // Validate required fields
    if (!title || !description || !Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({ error: 'Title, description, and at least one test case are required.' });
    }

    // Check for duplicate title
    const existing = await Problem.findOne({ title });
    if (existing) {
      return res.status(400).json({ error: 'Problem with this title already exists.' });
    }

    // Save problem
    const newProblem = new Problem({
      title,
      description,
      difficulty,
      inputFormat,
      outputFormat,
      sampleInput,
      sampleOutput,
      constraints,
      testCases
    });

    const savedProblem = await newProblem.save();

    // Return full problem with _id for redirection
    res.status(201).json(savedProblem);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProblem = async (req, res) => {
  try {
    const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Problem deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
