var path = require("path");
const TAG = "[" + path.basename(__filename) + "]";
const sequelizeConfig = require("../configs/sequelize.config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  sequelizeConfig,
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Users = require("../entities/user")(sequelize);
db.Projects = require("../entities/project")(sequelize);
db.OrganizationAdmins = require("../entities/project")(sequelize);
db.SBOMs = require("../entities/SBOM")(sequelize);


Object.keys(db).forEach((modelName) => {
  console.log(TAG, `init associate ${modelName}`);
  if (db[modelName]?.associate) {
    db[modelName].associate(db);
  }
});
module.exports = db;
