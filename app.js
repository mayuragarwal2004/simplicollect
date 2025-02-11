const path = require("path");
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const chapterRoutes = require("./routes/chapterRoutes");
const memberRoutes = require("./routes/memberRoutes");
const rightsRoutes = require("./routes/rightsRoutes");
const imageUploadRoutes = require("./routes/imageUploadRoutes");
const packageRoutes = require("./routes/packageRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const meetingRoutes = require("./routes/meetingRoutes");

const { authenticateToken } = require("./middlewares/authMiddleware");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "client/dist")));

// Visitor routes
app.use("/api/auth", authRoutes);
app.use("/api/visitor", visitorRoutes);
app.use("/api/chapter", authenticateToken, chapterRoutes);
app.use("/api/member", authenticateToken, memberRoutes);
app.use("/api/rights", authenticateToken, rightsRoutes);
app.use("/api/image-upload", authenticateToken, imageUploadRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/payment", authenticateToken, paymentRoutes);
app.use("/api/meetings", meetingRoutes);

app.use("/api/*", (req, res) => {
  res.status(404).send("Not Found - Please check the URL and try again");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
