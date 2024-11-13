const { DataTypes, Model } = require("sequelize");
const _ = require("lodash");
const { USER_STATUS } = require("../const/const");
module.exports = (sequelize) => {
  class Users extends Model {
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
      // this.hasMany(models.Vehicles, {
      //   foreignKey: "userId",
      //   targetKey: "userId",
      //   as: "FK_USER_VEHICLE",
      // });
    }
  }
  Users.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(128),
        unique: true,
      },
      password: {
        type: DataTypes.STRING(2048),
      },
      dateOfBirth: {
        type: DataTypes.DATE,
      },
      identityCardNumber: {
        type: DataTypes.STRING,
      },
      salt: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING(256),
      },
      avatar: {
        type: DataTypes.STRING(256),
      },
      phone: {
        type: DataTypes.STRING(11),
        unique: true,
      },
      email: {
        type: DataTypes.STRING(64),
        unique: true,
      },
      permissions: {
        type: DataTypes.JSON,
      },
      token: {
        type: DataTypes.STRING(2048),
      },
      refreshToken: {
        type: DataTypes.STRING(2048),
      },
      gafType: {
        type: DataTypes.STRING(32),
      },
      gafId: {
        type: DataTypes.STRING(1024),
        unique: true,
      },
      balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: "Số dư tài khoản",
      },
      biometricKey: {
        type: DataTypes.STRING(2048),
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
        validate: { isIn: [_.values(USER_STATUS)] },
        defaultValue: USER_STATUS.ACTIVE,
      },
    },
    {
      sequelize,
      modelName: "Users",
      tableName: "Users",
      indexes: [
        {
          name: "username_password_index",
          using: "BTREE",
          fields: ["username", "password"],
        },
        {
          name: "userId_token_index",
          using: "BTREE",
          fields: ["userId", "token"],
        },
      ],
    },
  );

  return Users;
};
