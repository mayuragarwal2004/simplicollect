const express = require("express");
const visitorRoutes = require("./routes/visitorRoutes");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "client/dist")));

// Visitor routes
app.use("/api", visitorRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
