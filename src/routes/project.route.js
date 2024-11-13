var express = require("express");
var router = express.Router();
const projectControllers = require("../controllers/project.controller.js");

router.get(
    "/project/test",
    projectControllers.test,
);

router.post(
    "/project",
    projectControllers.createProject,
);

router.get(
    "/project",
    projectControllers.getProjects,
);

router.put(
    "/project/:projectId",
    projectControllers.updateProject,
);

router.delete(
    "/project/:projectId",
    projectControllers.deleteProject,
);

module.exports = router;