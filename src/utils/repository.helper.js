const axios = require('axios');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

exports.validateRepoAccess = async (repoURLToken, githubUrl) => {
  try {
    const apiUrl = githubUrl.replace('https://github.com/', 'https://api.github.com/repos/');
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `token ${repoURLToken}`,
      },
    });
    return response.status === 200; // Access is valid if response status is 200
  } catch (error) {
    console.error('GitHub repo access validation error:', error);
    return false;
  }
}

exports.cloneRepository = async (repoUrl, projectId) => {
  const repoName = repoUrl.split('/').pop(); // Get repository name
  const projectPath = path.join(process.env.BASE_DIRECTORY,'public','repository',`${repoName}_${projectId}`);
  if (!fs.existsSync(projectPath)) fs.mkdirSync(projectPath, { recursive: true });
  return new Promise((resolve, reject) => {
    exec(`git clone ${repoUrl} "${projectPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error cloning repository: ${stderr}`);
        return reject(error);
      }
      resolve(projectPath);
    });
  });
}

exports.genSBOM = async (projectPath, type, outputFilePath) => {
  return new Promise((resolve, reject) => {
    const batchFilePath = `"E:\\Project_3_code\\backend\\src\\genSBOM.bat"`;
    const command = `cmd.exe /c ${batchFilePath} ${projectPath} ${type} ${outputFilePath}`;

    console.log(`Executing command: ${command}`);

    exec(command, { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing batch file: ${stderr}`);
            reject(new Error(`Batch file execution failed with error: ${stderr || error.message}`));
            return;
        }

        // Log standard output for debugging
        console.log("syft stdout:", stdout);

        // Log any warnings or non-critical errors
        if (stderr) {
            console.warn("syft stderr (warnings):", stderr);
        }

        resolve();
    });
});
}