const path = require("path");
const express = require("express");
const authRoutes = require("./src/authentication/route/authRoutes");
const visitorRoutes = require("./src/visitor/route/visitorRoutes");
const chapterRoutes = require("./src/chapter/route/chapterRoutes");
const memberRoutes = require("./src/member/route/memberRoutes");
const rightsRoutes = require("./src/rights/route/rightsRoutes");
const imageUploadRoutes = require("./src/imageUpload/route/imageUploadRoutes");
const packageRoutes = require("./src/package/route/packageRoutes");
const paymentRoutes = require("./src/payment/route/paymentRoutes");
const feeRecieverRoutes = require("./src/feeReceiver/route/feeReceiverRoutes");
const meetingRoutes = require("./src/meeting/route/meetingRoutes");

const { authenticateToken } = require("./src/middlewares/authMiddleware");
const { sendWhatsAppOtp } = require("./src/config/whatsapp");
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
app.use("/api/packages", authenticateToken, packageRoutes);
app.use("/api/payment", authenticateToken, paymentRoutes);
app.use("/api/feeReciever", authenticateToken, feeRecieverRoutes);
app.use("/api/meetings", authenticateToken, meetingRoutes);
app.use("/api/profile", authenticateToken, require("./src/profile/route/profileRoutes"));
app.use("/api/report", authenticateToken, require("./src/report/route/reportRoutes"));
app.use("/api/chapter-payment", authenticateToken, require("./src/chapterPayment/route/chapterPaymentRoutes"));
app.get("/api/testWA", async (req, res) => {
  const result = await sendWhatsAppOtp("919921318237", "1234");
  if (result.ok) {
    res.send("Success");
  } else {
    res.status(500).send("Failed");
  }
});

// admin routes
app.use("/api/organisations", authenticateToken, require("./src/organisation/route/organisationRoutes"));
app.use("/api/admin/chapters", authenticateToken, require("./src/chapter/route/adminChapterRoutes"));
app.use("/api/admin/chapter-member-list", authenticateToken, require("./src/chapter/route/adminChapterMemberListRoutes"));
app.use("/api/admin/members", authenticateToken, require("./src/member/route/adminMemberRoutes"));

app.use("/api/*", (req, res) => {
  res.status(404).send("Not Found - Please check the URL and try again");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
