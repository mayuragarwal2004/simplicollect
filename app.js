const path = require("path");
const express = require("express");
const visitorRoutes = require("./routes/visitorRoutes");
const authRoutes = require("./routes/authRoutes");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "client/dist")));

// Visitor routes
app.use("/api/auth", authRoutes);
app.use("/api/visitor", visitorRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
