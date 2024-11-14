var path = require("path");
const TAG = `[${path.basename(__filename)}] `;
const err = require("../configs/error");
const utils = require("../utils/utils");

const {
    createProject,
    getProjects,
    updateProject,
    deleteProject,
} = require("../usecases/project");
const { validateRepoAccess, cloneRepository } = require("../utils/repository.helper");
const { getManagerById } = require("../usecases/projectManager");

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
module.exports.createProject = async (req, res) => {
    try {
        const { name, description, repoURL, repoAPIToken, organizationAdminId, status, projectManagerId } = req.body;
    
        if (!repoURL) {
            console.error(TAG, err.ERROR_MISSING_PARAMS.description);
            return res.json(utils.responseFailed(
                err.ERROR_MISSING_PARAMS.code, {
                    message: res.__(err.ERROR_MISSING_PARAMS.description),
                }
            ));
        }

        if (repoAPIToken) {
            const isValid = await validateRepoAccess(repoAPIToken, repoURL);
            if (!isValid) {
                console.error(TAG, err.INVALID_GITHUB_TOKEN);
                return res.json(utils.responseFailed(err.INVALID_GITHUB_TOKEN.code, {
                    message: res.__(err.INVALID_GITHUB_TOKEN.description),
                }));
            }
        }

        if (projectManagerId) {
            const manager = await getManagerById(projectManagerId);
            if (!manager) {
                console.error(TAG, err.ERROR_USER_NOT_FOUND.description);
                return res.json(
                    utils.responseFailed(err.ERROR_USER_NOT_FOUND.code, {
                        message: res.__(err.ERROR_USER_NOT_FOUND.description),
                    }),
                );
            }
        }

        let newProject = {
            name,
            organizationAdminId,
            description,
            repoURL,
            repoAPIToken,
            status,
            projectManagerId,
        };
        newProject = await createProject(newProject);

        const projectPath = await cloneRepository(repoURL, newProject.projectId);
        let path = await updateProject(newProject.projectId, {
            projectPath: projectPath,
        });

        return res.json(utils.responseSuccess(newProject));
      } catch (error) {
        console.error(TAG, error);
        return res.json(
            utils.responseFailed(err.ERROR_SERVER_INTERNAL.code, {
                message:
                    error?.message ?? res.__(err.ERROR_SERVER_INTERNAL.description),
            }),
        );
      };
}

module.exports.getProjects = async (req, res) => {
    try {
        let {
            q,
            page,
            limit,
            orderMode,
            orderField,
            status,
        } = req.query;

        q = q ?? "";
        orderField = orderField ?? "createdAt";
        orderMode = orderMode ?? "DESC";
        page = isNaN(parseInt(page)) ? PAGE_PAGINATION : parseInt(page);
        limit = isNaN(parseInt(limit)) ? LIMIT_PAGINATION : parseInt(limit);
        status = _.values(TAG_STATUS).includes(status) ? status : null;
    
        const result = await getProjects({
          q,
          page,
          limit,
          orderMode,
          orderField,
          status,
          stationId,
        });
    
        return res.json(utils.responseSuccess(result));
    } catch (error) {
        console.error(TAG, error);
        return res.json(
            utils.responseFailed(err.ERROR_SERVER_INTERNAL.code, {
                message:
                    error?.message ?? res.__(err.ERROR_SERVER_INTERNAL.description),
            }),
        );
      };
};

module.exports.updateProject = async (req, res) => {
    try {
        let { projectId } = req.params;
        const { name, description, repoURL, repoAPIToken, organizationAdminId, status } = req.body;

        if ((repoURL && !repoAPIToken) || (!repoURL && repoAPIToken)) {
            console.error(TAG, err.ERROR_MISSING_PARAMS.description);
            return res.json(utils.responseFailed(
                err.ERROR_MISSING_PARAMS.code, {
                    message: res.__(err.ERROR_MISSING_PARAMS.description),
                }
            ));
        }

        if (repoAPIToken && repoURL) {
            const isValid = await validateRepoAccess(repoAPIToken, repoURL);
            if (!isValid) {
                console.error(TAG, err.INVALID_GITHUB_TOKEN);
                return res.json(utils.responseFailed(err.INVALID_GITHUB_TOKEN, {
                    message: res.__(err.INVALID_GITHUB_TOKEN.description),
                }));
            }
        }

        let newProject = {
            name,
            organizationAdminId,
            description,
            repoURL,
            repoAPIToken,
            status,
        };
        newProject = await updateProject(projectId, newProject);
        return res.json(utils.responseSuccess(newProject));
    } catch (error) {
        console.error(TAG, error);
        return res.json(
            utils.responseFailed(err.ERROR_SERVER_INTERNAL.code, {
                message:
                    error?.message ?? res.__(err.ERROR_SERVER_INTERNAL.description),
            }),
        );
      };
};

module.exports.deleteProject = async (req, res) => {
    try {
        let {projectId} = req.params;
        let result = await deleteProject(projectId);
        return res.json(utils.responseSuccess(result));
    } catch (error) {
        console.error(TAG, error);
        return res.json(
            utils.responseFailed(err.ERROR_SERVER_INTERNAL.code, {
                message:
                    error?.message ?? res.__(err.ERROR_SERVER_INTERNAL.description),
            }),
        );
      };
};