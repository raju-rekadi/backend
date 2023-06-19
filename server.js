const database = require("./config/database");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "5r5fwferrewrerrd", resave: true, saveUninitialized: true }));
// set up cors to allow us to accept requests from our client
app.use(cors());

const passport = require("passport");

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(require("./routers/user"));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to WebOconnect task application." });
});

// set port, listen for requests
const PORT = process.env.PORT || 6969;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});