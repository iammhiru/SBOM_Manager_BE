const { DataTypes, Model } = require("sequelize");
const _ = require("lodash");
const { PROJECT_MANAGER_STATUS } = require("../const/const");
module.exports = (sequelize) => {
  class ProjectManagers extends Model {
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }
  }
  ProjectManagers.init(
    {
      projectManagerId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(128),
      },
      username: {
        type: DataTypes.STRING(128),
      },
      email: {
        type: DataTypes.STRING(128),
      },
      password: {
        type: DataTypes.STRING(128),
      },
      organizationName: {
        type: DataTypes.STRING(128),
      },
      otp: {
        type: DataTypes.STRING,
        comment: "OPT from email",
      },
      expiryOtp: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.STRING(32),
        validate: { isIn: [_.values(PROJECT_MANAGER_STATUS)] },
        defaultValue: PROJECT_MANAGER_STATUS.ACTIVE,
      },
    },
    {
      sequelize,
      modelName: "ProjectManagers",
      tableName: "ProjectManagers",
    },
  );

  return ProjectManagers;
};
