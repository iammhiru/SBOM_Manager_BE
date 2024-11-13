const axios = require('axios');
const { exec } = require('child_process');
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

exports.genSBOM = async (projectPath, type, name) => {
  return new Promise((resolve, reject) => {
    const command = `syft "${projectPath}" -o ${type} > "${name}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error generating SBOM: ${stderr}`);
        return reject(error);
      }
      resolve(name);
    });
  });;
}