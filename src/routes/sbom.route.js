var express = require("express");
var router = express.Router();
const projectControllers = require("../controllers/sbom.controller.js");

router.get(
    "/sbom/test",
    projectControllers.test,
);

router.post(
    "/sbom/:projectId",
    projectControllers.createSBOM,
);

// router.get(
//     "/project",
//     projectControllers.getProjects,
// );

// router.put(
//     "/project/:projectId",
//     projectControllers.updateProject,
// );

// router.delete(
//     "/project/:projectId",
//     projectControllers.deleteProject,
// );

module.exports = router;