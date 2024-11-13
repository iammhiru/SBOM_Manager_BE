const { DataTypes, Model } = require("sequelize");
const _ = require("lodash");
const { ORGANIZATION_ADMIN_STATUS } = require("../const/const");
module.exports = (sequelize) => {
  class OrganizationAdmins extends Model {
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }
  }
  OrganizationAdmins.init(
    {
      organizationAdminId: {
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
        validate: { isIn: [_.values(ORGANIZATION_ADMIN_STATUS)] },
        defaultValue: ORGANIZATION_ADMIN_STATUS.ACTIVE,
      },
    },
    {
      sequelize,
      modelName: "OrganizationAdmins",
      tableName: "OrganizationAdmins",
    },
  );

  return OrganizationAdmins;
};
