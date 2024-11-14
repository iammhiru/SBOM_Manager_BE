const db = require("../../services/database");
const { PROJECT_MANAGER_STATUS } = require("../../const/const");
const { Op } = require("sequelize");

exports.test = async () => {
  return "test API";
};

exports.getManagerById = async (id) => {
  return db.ProjectManagers.findOne({
    where: {
      projectManagerId: id,
    },
  });
};

exports.getManagerByPhone = async (phone) => {
  return db.ProjectManagers.findOne({
    where: {
      phone: phone,
    },
  });
};

exports.getManagerByUsername = async (username) => {
  return db.ProjectManagers.findOne({
    where: {
      username: username,
    },
  });
};

exports.getManagerByEmail = async (email) => {
  return db.ProjectManagers.findOne({
    where: {
      email: email,
    },
  });
};

exports.updateManager = async (id, newUser) => {
  return db.ProjectManagers.update(newUser, {
    where: {
      projectManagerId: id,
    },
  });
};

exports.createManager = async (newUser) => {
  return db.ProjectManagers.create(newUser);
};

exports.activateManagerAccount = async (userId) => {
  return db.ProjectManagers.update(
    {
      status: PROJECT_MANAGER_STATUS.ACTIVE,
    },
    {
      where: {
        projectManagerId: userId,
      },
    },
  );
};

exports.deleteManager = async (userId) => {
  return db.ProjectManagers.update(
    {
      status: PROJECT_MANAGER_STATUS.INACTIVE,
    },
    {
      where: {
        projectManagerId: userId,
      },
    },
  );
};
