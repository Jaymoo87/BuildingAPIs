const express = require("express");
const cors = require("cors");
const path = require("path");
const apiRouter = require("./routes");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");

let app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("client"));
app.use("/api", apiRouter);
app.use(morgan("dev"));
app.use(compression());
app.use(helmet());

app.listen(3000, () => console.log("Just Out Here Connected AF (3000)"));
