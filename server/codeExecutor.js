const fs = require("fs");
const path = require("path");
const os = require("os");
const { exec } = require("child_process");
const { v4: uuid } = require("uuid");

const codeFolder = path.join(__dirname, "../codes");
if (!fs.existsSync(codeFolder)) fs.mkdirSync(codeFolder);

const toDockerPath = (p) => {
  if (os.platform() === "win32") {
    return p.replace(/\\/g, "/").replace(/^([A-Z]):/, (_, d) => `/${d.toLowerCase()}`);
  }
  return p;
};

const executeCode = (language, code, input = "") => {
  return new Promise((resolve, reject) => {
    const jobId = uuid();

    let fileExtension, compileCmd = "", runCmd = "", outputFile = "", dockerImage = "";

    switch (language) {
      case "python":
        fileExtension = "py";
        runCmd = `python ${jobId}.py < ${jobId}.txt`;
        dockerImage = "python:3.8";
        break;
      case "cpp":
        fileExtension = "cpp";
        compileCmd = `g++ ${jobId}.cpp -o ${jobId}.out`;
        runCmd = `./${jobId}.out < ${jobId}.txt`;
        dockerImage = "gcc:latest";
        outputFile = `${jobId}.out`;
        break;
      case "c":
        fileExtension = "c";
        compileCmd = `gcc ${jobId}.c -o ${jobId}.out`;
        runCmd = `./${jobId}.out < ${jobId}.txt`;
        dockerImage = "gcc:latest";
        outputFile = `${jobId}.out`;
        break;
      case "java":
        fileExtension = "java";
        compileCmd = `javac Main.java`;
        runCmd = `java Main < ${jobId}.txt`;
        dockerImage = "openjdk:latest";
        break;
      case "node":
        fileExtension = "js";
        runCmd = `node ${jobId}.js < ${jobId}.txt`;
        dockerImage = "node:latest";
        break;
      case "ruby":
        fileExtension = "rb";
        runCmd = `ruby ${jobId}.rb < ${jobId}.txt`;
        dockerImage = "ruby:latest";
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

      const dockerSafePath = toDockerPath(codeFolder);
      const dockerCmd = `docker run --rm -v "${dockerSafePath}:/app" -w /app ${dockerImage} sh -c "${compileCmd ? compileCmd + ' && ' : ''}${runCmd}"`;

      console.log("🐳 Docker Command:", dockerCmd);

      exec(dockerCmd, (error, stdout, stderr) => {
        // Cleanup
        fs.unlinkSync(filePath);
        fs.unlinkSync(inputPath);
        if (outputFile && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        if (language === "java") {
          const classFile = path.join(codeFolder, "Main.class");
          if (fs.existsSync(classFile)) fs.unlinkSync(classFile);
        }

        if (error) {
          console.error("❌ Error:", stderr || error.message);
          return reject(new Error(stderr || error.message));
        }

        return resolve(stdout);
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
