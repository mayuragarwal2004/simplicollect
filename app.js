const express = require("express");
const visitorRoutes = require("./routes/visitorRoutes");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

// Visitor routes
app.use("/api", visitorRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
