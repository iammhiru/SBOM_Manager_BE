const { DataTypes, Model } = require("sequelize");
const _ = require("lodash");
const { SBOM_STATUS } = require("../const/const");
module.exports = (sequelize) => {
  class SBOMs extends Model {
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }
  }
  SBOMs.init(
    {
      SBOMId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      projectId: {
        type: DataTypes.INTEGER,
      },
      SBOMFormat: {
        type: DataTypes.STRING(128),
      },
      SBOMStandard: {
        type: DataTypes.STRING(2048),
      },
      metadata: {
        type: DataTypes.JSON,
      },
      SBOMPath: {
        type: DataTypes.STRING(256),
      },
      status: {
        type: DataTypes.STRING(32),
        validate: { isIn: [_.values(SBOM_STATUS)] },
        defaultValue: SBOM_STATUS.ACTIVE,
      },
    },
    {
      sequelize,
      modelName: "SBOMs",
      tableName: "SBOMs",
    },
  );

  return SBOMs;
};
