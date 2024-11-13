const db = require("../../services/database");
const { SBOM_STATUS } = require("../../const/const");

exports.createSBOM = async (newSBOM) => {
    return db.SBOMs.create(newSBOM);
};
