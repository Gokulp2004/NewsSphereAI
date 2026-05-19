const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const openapi = require("./docs/openapi");
const env = require("./config/env");
const { rateLimiter } = require("./middleware/rateLimiter");
const { apiKeyAuth } = require("./middleware/apiKeyAuth");
const { notFound } = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");
const apiRoutes = require("./routes");
const healthRoutes = require("./routes/healthRoutes");

const app = express();

app.use(helmet());
const corsOptions = {
    origin: env.corsOrigin,
    credentials: env.corsOrigin !== "*"
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(rateLimiter);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapi));
app.use("/api", healthRoutes);
app.use("/api", apiKeyAuth, apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
