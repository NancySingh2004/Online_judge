const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { v4: uuid } = require("uuid");

// Folder to store temp code/input files
const codeFolder = path.join(__dirname, "../codes");
if (!fs.existsSync(codeFolder)) fs.mkdirSync(codeFolder);

const executeCode = (language, code, input = "") => {
  return new Promise((resolve, reject) => {
    if (language !== "python") {
      return reject({ error: "Only Python is supported for now." });
    }

    const jobId = uuid(); // Unique ID
    const codeFile = `${jobId}.py`;
    const inputFile = `${jobId}.txt`;
    const codePath = path.join(codeFolder, codeFile);
    const inputPath = path.join(codeFolder, inputFile);

    // Save code and input
    fs.writeFileSync(codePath, code);
    fs.writeFileSync(inputPath, input);

    // Docker run command
    const dockerCmd = `docker run --rm -v "${codeFolder}:/app" -w /app python:3.8 sh -c "python ${codeFile} < ${inputFile}"`;

    exec(dockerCmd, (error, stdout, stderr) => {
      // Clean up files
      fs.unlinkSync(codePath);
      fs.unlinkSync(inputPath);

      if (error) {
        return reject({ error: "Execution failed", details: stderr || error.message });
      }
      return resolve(stdout);
    });
  });
};

module.exports = { executeCode };
