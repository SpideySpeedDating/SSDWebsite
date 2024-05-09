const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

const routesUsers = require("./routes/users");
const routesQuestions = require("./routes/questions");
const routesAnswers = require("./routes/answers");
const routesAuthentication = require("./routes/authentication");

app.use("/api/questions", routesQuestions());
app.use("/api/users", routesUsers());
app.use("/api/answers", routesAnswers());
app.use("/auth", routesAuthentication());

app.get("/api/status", (req, res) => {
    const status = {
        "Status": "Running"
    }

    res.send(status)
});

module.exports = app;