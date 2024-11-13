const { DataTypes, Model } = require("sequelize");
const _ = require("lodash");
const { PROJECT_STATUS } = require("../const/const");
module.exports = (sequelize) => {
  class Projects extends Model {
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }
  }
  Projects.init(
    {
      projectId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      organizationAdminId: {
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING(128),
      },
      description: {
        type: DataTypes.STRING(2048),
      },
      repoURL: {
        type: DataTypes.STRING(256),
      },
      repoAPIToken: {
        type: DataTypes.STRING(256),
      },
      projectPath: {
        type: DataTypes.STRING(256),
      },
      status: {
        type: DataTypes.STRING(32),
        validate: { isIn: [_.values(PROJECT_STATUS)] },
        defaultValue: PROJECT_STATUS.ACTIVE,
      },
    },
    {
      sequelize,
      modelName: "Projects",
      tableName: "Projects",
    },
  );

  return Projects;
};
