const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3000;

// middleware
app.use(express.json());
app.use(cors());

// DB connect
mongoose.connect("mongodb://127.0.0.1:27017/wafDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// test route
app.get("/", (req, res) => {
  res.send("AI WAF Running 🚀");
});

// routes
const wafRoutes = require("./routes/wafRoutes");
app.use("/api", wafRoutes);

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});