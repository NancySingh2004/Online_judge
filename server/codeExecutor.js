const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { v4: uuid } = require("uuid");

const codeFolder = path.join(__dirname, "codes");
if (!fs.existsSync(codeFolder)) fs.mkdirSync(codeFolder);

const executeCode = (language, code, input = "") => {
  return new Promise((resolve, reject) => {
    const jobId = uuid();

    let fileExtension, compileCmd = "", runCmd = "", outputFile = "";

    switch (language) {
      case "python":
        fileExtension = "py";
        runCmd = `python3 ${jobId}.py < ${jobId}.txt`;
        break;
      case "cpp":
        fileExtension = "cpp";
        compileCmd = `g++ ${jobId}.cpp -o ${jobId}.out`;
        runCmd = `./${jobId}.out < ${jobId}.txt`;
        outputFile = `${jobId}.out`;
        break;
      case "c":
        fileExtension = "c";
        compileCmd = `gcc ${jobId}.c -o ${jobId}.out`;
        runCmd = `./${jobId}.out < ${jobId}.txt`;
        outputFile = `${jobId}.out`;
        break;
      case "java":
        fileExtension = "java";
        compileCmd = `javac Main.java`;
        runCmd = `java Main < ${jobId}.txt`;
        break;
      case "node":
        fileExtension = "js";
        runCmd = `node ${jobId}.js < ${jobId}.txt`;
        break;
      case "ruby":
        fileExtension = "rb";
        runCmd = `ruby ${jobId}.rb < ${jobId}.txt`;
        break;
      default:
        return reject(new Error("Unsupported language"));
    }

    const fileName = language === "java" ? "Main.java" : `${jobId}.${fileExtension}`;
    const inputFile = `${jobId}.txt`;
    const filePath = path.join(codeFolder, fileName);
    const inputPath = path.join(codeFolder, inputFile);
    const outputPath = path.join(codeFolder, outputFile);

    try {
      fs.writeFileSync(filePath, code);
      fs.writeFileSync(inputPath, input);

      const command = (compileCmd ? compileCmd + " && " : "") + runCmd;

      exec(command, { cwd: codeFolder, timeout: 10000 }, (error, stdout, stderr) => {
        // Cleanup
        fs.unlinkSync(filePath);
        fs.unlinkSync(inputPath);
        if (outputFile && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        if (language === "java") {
          const classFile = path.join(codeFolder, "Main.class");
          if (fs.existsSync(classFile)) fs.unlinkSync(classFile);
        }

        if (error) {
          return reject(new Error(stderr || error.message));
        }

        resolve(stdout);
      });
    } catch (err) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      return reject(new Error("Internal error: " + err.message));
    }
  });
};

module.exports = { executeCode };
