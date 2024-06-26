const express = require("express");
const path = require("path");

const port = process.env.PORT ? process.env.PORT : 3000;

const app = express();

app.use("/index.js", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.js"));
});

app.use("/templates", (req, res) => {
  res.sendFile(path.resolve(__dirname, "templates.xml"));
})

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});

app.use("/lib", express.static(path.resolve(__dirname, "lib")));
app.use("/css", express.static(path.resolve(__dirname, "css")));
app.use("/img", express.static(path.resolve(__dirname, "img")));


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
  console.log(`http://localhost:${port}`)
})