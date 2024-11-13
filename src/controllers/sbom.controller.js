var path = require("path");
const TAG = `[${path.basename(__filename)}] `;
const err = require("../configs/error");
const utils = require("../utils/utils");
const { exec } = require('child_process');
const moment = require('moment');
const fs = require("fs");

const {
    createProject,
    getProjects,
    updateProject,
    deleteProject,
    getProjectWithId,
} = require("../usecases/project");
const {
    createSBOM
} = require("../usecases/SBOM");
const { SBOM_STANDARD } = require("../const/const");
const { DATE_FILENAME } = require("../const/common");
const {genSBOM}= require("../utils/repository.helper");
/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
module.exports.test = async (req, res) => {
    try {
      return res.json({ message: "Projects Module ready!!!" });
    } catch (error) {
      console.error(TAG, error);
      return res.json(
        utils.responseFailed(err.ERROR_SERVER_INTERNAL.code, {
          message:
            error?.message ?? res.__(err.ERROR_SERVER_INTERNAL.description),
        }),
      );
    }
  };

  /**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
module.exports.createSBOM = async (req, res) => {
    try {
        let { projectId } = req.params;
        let { format, standard } = req.body;

        let project = await getProjectWithId(projectId);
        if (!project) {
            console.error(TAG, err.PROJECT_NOT_EXIST.description);
            return res.json(
                utils.responseFailed(err.PROJECT_NOT_EXIST.code, {
                    message: res.__(err.PROJECT_NOT_EXIST.description),
                }),
            );
        }
        let type = null;

        for (const key in SBOM_STANDARD) {
            for (const key in SBOM_STANDARD) {
                const entry = SBOM_STANDARD[key];
                if (entry.FORMAT === format && entry.STANDARD === standard) {
                  type = key;
                }
            }
        }

        if (!type) {
            console.error(TAG, err.NOT_VALID_FORMAT.description);
            return res.json(
                utils.responseFailed(err.NOT_VALID_FORMAT.code, {
                    message: res.__(err.NOT_VALID_FORMAT.description),
                }),
            );
        }

        const projectPath = path.join(process.env.BASE_DIRECTORY,'public','sbom',`${projectId}_${moment().format(DATE_FILENAME)}`);
        if (!fs.existsSync(projectPath)) fs.mkdirSync(projectPath, { recursive: true });
        const command = `syft "${project.projectPath}" -o ${type} > "${projectPath}/SBOM.json"`;
        const fname = `${projectPath}/SBOM.json`;
        console.log(command);
        // exec(command, (error, stdout, stderr) => {
        //     if (error) {
        //       console.error(`Error generating SBOM: ${stderr}`);
        //     }
        // });

        let re = await genSBOM(projectPath, type, fname);
        
        let newSBOM = {
            projectId,
            SBOMFormat: format,
            SBOMStandard: standard,
            SBOMPath: `${projectPath}/SBOM.json`
        };

        newSBOM = await createSBOM(newSBOM);
      return res.json(utils.responseSuccess(newSBOM));
    } catch (error) {
      console.error(TAG, error);
      return res.json(
        utils.responseFailed(err.ERROR_SERVER_INTERNAL.code, {
          message:
            error?.message ?? res.__(err.ERROR_SERVER_INTERNAL.description),
        }),
      );
    }
  };
