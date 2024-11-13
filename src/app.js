var express = require("express");
var path = require("path");
const TAG = `[${path.basename(__filename)}] `;
const cors = require("cors");
var cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
require("body-parser-xml")(bodyParser);

const userRouter = require("./routes/user.route");
const projectRouter = require("./routes/project.route");
const sbomRouter = require("./routes/sbom.route.js");


global.__basedir = __dirname;
const { initLogger } = require("./services/logger");
var app = express();
var useragent = require("express-useragent");
// const i18n = require("i18n");
// require("./i18n/i18n.config");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
initLogger();
app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
// var loggerMorgan = require('morgan');
// app.use(loggerMorgan('dev'));

app.use(cookieParser());
app.use(
  bodyParser.json({
    limit: "128mb",
  }),
);
app.use(bodyParser.xml());
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "128mb",
    parameterLimit: 128000,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(useragent.express());
app.use(
  fileUpload({
    createParentPath: true,
    parseNested: true,
  }),
);
// app.use(i18n.init);

// middleware
const deleteEmptyBodyMiddleware = require("./middlewares/delete-empty-body.middleware.js");
const { LoggerMiddleware } = require("./middlewares/logger.middleware.js");
const { API_NOT_FOUND } = require("./configs/error.js");
const { responseFailed } = require("./utils/utils.js");
app.use(deleteEmptyBodyMiddleware);
app.use(LoggerMiddleware);
//route
app.use(
  `${process.env.ROUTE_PATH ?? "/api/v1"}/public`,
  express.static(path.join(process.env.PATH_PUBLIC_DIR)),
);
app.use(`${process.env.ROUTE_PATH ?? "/api/v1"}`, userRouter);
app.use(`${process.env.ROUTE_PATH ?? "/api/v1"}`, projectRouter);
app.use(`${process.env.ROUTE_PATH ?? "/api/v1"}`, sbomRouter);


// catch 404 and forward to error handler
app.use(function (req, res) {
  console.error(TAG, req.originalUrl);
  res
    .status(404)
    .json(responseFailed(API_NOT_FOUND.code, API_NOT_FOUND.description));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).send("");
  // res.render("error");
});

module.exports = app;
