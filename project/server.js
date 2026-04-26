const express = require("express");
const path = require("path");
const session = require("express-session");
const mongoose = require("mongoose");

const app = express();

// ✅ middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ test route
app.get("/test", (req, res) => {
  res.send("Working ✅");
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("Mongo Error ❌", err));

// ✅ session
app.use(
  session({
    secret: "mysecretKey",
    resave: false,
    saveUninitialized: false,
  })
);

// ✅ view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ routes
const wafRoutes = require("./routes/wafroutes");
console.log("WAF ROUTES LOADED");

app.use("/api", wafRoutes);

// ✅ auth routes
app.get("/", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "123") {
    req.session.user = username;
    res.redirect("/dashboard");
  } else {
    res.send("Invalid credentials");
  }
});

app.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.render("dashboard", { username: req.session.user });
  } else {
    res.redirect("/");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// ✅ ONLY ONE SERVER START
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});