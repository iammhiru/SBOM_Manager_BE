const db = require("../../services/database");
const { USER_STATUS } = require("../../const/const");
const { Op } = require("sequelize");

exports.test = async () => {
  return "test API";
};

exports.getUserById = async (id) => {
  return db.Users.findOne({
    where: {
      userId: id,
    },
  });
};

exports.getUserByPhone = async (phone) => {
  return db.Users.findOne({
    where: {
      phone: phone,
    },
  });
};

exports.getUserByUsername = async (username) => {
  return db.Users.findOne({
    where: {
      username: username,
    },
  });
};

exports.getUserByEmail = async (email) => {
  return db.Users.findOne({
    where: {
      email: email,
    },
  });
};

exports.updateUser = async (id, newUser) => {
  return db.Users.update(newUser, {
    where: {
      userId: id,
    },
  });
};

exports.createUser = async (newUser) => {
  return db.Users.create(newUser);
};

exports.activateAccount = async (userId) => {
  return db.Users.update(
    {
      status: USER_STATUS.ACTIVE,
    },
    {
      where: {
        userId: userId,
      },
    },
  );
};

exports.deleteUser = async (userId) => {
  return db.Users.update(
    {
      status: USER_STATUS.INACTIVE,
    },
    {
      where: {
        userId: userId,
      },
    },
  );
};
