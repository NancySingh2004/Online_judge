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
    let fileName, className;

    const isWindows = process.platform === "win32";

    switch (language) {
      case "python":
        fileExtension = "py";
        fileName = `${jobId}.py`;
        runCmd = `python3 ${fileName} < ${jobId}.txt`;
        break;

      case "cpp":
        fileExtension = "cpp";
        fileName = `${jobId}.cpp`;
        outputFile = isWindows ? `${jobId}.exe` : `${jobId}`;
        compileCmd = `g++ "${fileName}" -o "${outputFile}"`;
        runCmd = isWindows
          ? `"${outputFile}" < "${jobId}.txt"`
          : `./${outputFile} < "${jobId}.txt"`;
        break;

      case "c":
        fileExtension = "c";
        fileName = `${jobId}.c`;
        outputFile = isWindows ? `${jobId}.exe` : `${jobId}`;
        compileCmd = `gcc "${fileName}" -o "${outputFile}"`;
        runCmd = isWindows
          ? `type "${jobId}.txt" | "${outputFile}"`
          : `./${outputFile} < "${jobId}.txt"`;
        break;

      case "java":
        fileExtension = "java";
        className = `Main${jobId.replace(/-/g, "")}`;
        fileName = `${className}.java`;
        code = code.replace(/public\s+class\s+\w+/, `public class ${className}`);
        compileCmd = `javac ${fileName}`;
        runCmd = `java ${className} < ${jobId}.txt`;
        break;

      case "node":
        fileExtension = "js";
        fileName = `${jobId}.js`;
        runCmd = `node ${fileName} < ${jobId}.txt`;
        break;

      case "ruby":
        fileExtension = "rb";
        fileName = `${jobId}.rb`;
        runCmd = `ruby ${fileName} < ${jobId}.txt`;
        break;

      default:
        return reject(new Error("Unsupported language"));
    }

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
          const classFile = path.join(codeFolder, `${className}.class`);
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
      if (language === "java") {
        const classFile = path.join(codeFolder, `${className}.class`);
        if (fs.existsSync(classFile)) fs.unlinkSync(classFile);
      }
      return reject(new Error("Internal error: " + err.message));
    }
  });
};

module.exports = { executeCode };
