const mongoose = require("mongoose");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connection } = require("./connection");
const { userRouter } = require("./routes/user.routes");
const { noteRouter } = require("./routes/note.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users",userRouter)
app.use("/notes", noteRouter)

app.get("/", (req, res) => {
  res.send("Server Testing OK");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, async (req, res) => {
  try {
    await connection;
    console.log(`Server is connected on PORT ${PORT}`);
  } catch (err) {
    console.log("Error in connecting to DB");
    console.log(err);
  }
});

module.exports = { app };
