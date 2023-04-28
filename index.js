const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const path = require("path");
const gameRoutes = require("./Routes/gameRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(__dirname + "/public"));

//Authentication page
app.get("/", (req, res) => {
  res.render("homePage.ejs", { error: null });
});

//Game Routes
app.use(gameRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Successfully connected mongoDB");
  })
  .catch((e) => console.log(e));

app.listen(3000, () => {
  console.log("Listing on port 3000");
});
