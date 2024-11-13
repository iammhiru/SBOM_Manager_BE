const db = require("../../services/database");
const { PROJECT_STATUS } = require("../../const/const");

exports.createProject = async (newProject) => {
    return db.Projects.create(newProject);
};

exports.getProjects = async ({
    q,
    page,
    limit,
    orderMode,
    orderField,
    status,
}) => {
    let conditions = {};
    if (q) {

    }
  
    if (status) {
        conditions[Op.and] = conditions[Op.and] ?? [];
        conditions[Op.and].push({
            status: status,
        });
    }
    
    return db.Projects.findAndCountAll({
      where: conditions,
      limit,
      offset: limit * page,
      order: [[orderField, orderMode]],
      distinct: true,
    });
};

exports.updateProject = async (projectId, newProject) => {
    return db.Projects.update(newProject, {
        where: {
            projectId: projectId,
        },
    });
};

exports.deleteProject = async (projectId) => {
    return db.Projects.update(
        {
            status: PROJECT_STATUS.INACTIVE,
        }, 
        {
            where: {
                projectId: projectId,
            },
        }
    );
};

exports.getProjectWithId = async (projectId) => {
    return db.Projects.findOne({
        where: {
            projectId: projectId,
        },
    });
};