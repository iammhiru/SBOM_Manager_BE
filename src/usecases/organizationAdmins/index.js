const db = require("../../services/database");
const { ORGANIZATION_ADMIN_STATUS } = require("../../const/const");
const { Op } = require("sequelize");

exports.test = async () => {
  return "test API";
};

exports.getAdminById = async (id) => {
  return db.OrganizationAdmins.findOne({
    where: {
      userId: id,
    },
  });
};

exports.getAdminByPhone = async (phone) => {
  return db.OrganizationAdmins.findOne({
    where: {
      phone: phone,
    },
  });
};

exports.getAdminByUsername = async (username) => {
  return db.OrganizationAdmins.findOne({
    where: {
      username: username,
    },
  });
};

exports.getAdminByEmail = async (email) => {
  return db.OrganizationAdmins.findOne({
    where: {
      email: email,
    },
  });
};

exports.updateAdmin = async (id, newUser) => {
  return db.OrganizationAdmins.update(newUser, {
    where: {
      organizationAdminId: id,
    },
  });
};

exports.createAdmin = async (newUser) => {
  return db.OrganizationAdmins.create(newUser);
};

exports.activateAdminAccount = async (userId) => {
  return db.OrganizationAdmins.update(
    {
      status: ORGANIZATION_ADMIN_STATUS.ACTIVE,
    },
    {
      where: {
        organizationAdminId: userId,
      },
    },
  );
};

exports.deleteAdmin = async (userId) => {
  return db.OrganizationAdmins.update(
    {
      status: ORGANIZATION_ADMIN_STATUS.INACTIVE,
    },
    {
      where: {
        organizationAdminId: userId,
      },
    },
  );
};
