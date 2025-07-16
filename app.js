const path = require("path");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/authentication/route/authRoutes");
const visitorRoutes = require("./src/visitor/route/visitorRoutes");
const chapterRoutes = require("./src/chapter/route/chapterRoutes");
const memberRoutes = require("./src/member/route/memberRoutes");
const rightsRoutes = require("./src/rights/route/rightsRoutes");
const imageUploadRoutes = require("./src/imageUpload/route/imageUploadRoutes");
const packageRoutes = require("./src/package/route/packageRoutes");
const paymentRoutes = require("./src/payment/route/paymentRoutes");
const feeReceiverRoutes = require("./src/feeReceiver/route/feeReceiverRoutes");
const meetingRoutes = require("./src/meeting/route/meetingRoutes");
const homepageRoutes = require("./src/homepage/route/homepageRoutes");
const notificationRoutes = require("./src/notification/route/notificationRoutes");
const contactRoutes = require("./src/contact/route/contactRoutes");

const { authenticateToken, AuthenticateAdmin } = require("./src/middlewares/authMiddleware");
require('./src/feeReceiver/cron/pendingRequestNotifier');
require('./src/homepage/cron/statisticsCache');
const PORT = process.env.PORT || 5000;

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8100',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8100',
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'https://localhost'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, "client/dist")));

// Homepage routes (public - no authentication required)
app.use("/api/homepage", homepageRoutes);

// Visitor routes
app.use("/api/auth", authRoutes);
app.use("/api/visitor", visitorRoutes);
app.use("/api/chapter", authenticateToken, chapterRoutes);
app.use("/api/member", authenticateToken, memberRoutes);
app.use("/api/rights", authenticateToken, rightsRoutes);
app.use("/api/image-upload",  imageUploadRoutes);
app.use("/api/packages", authenticateToken, packageRoutes);
app.use("/api/payment", authenticateToken, paymentRoutes);
app.use("/api/feeReceiver", authenticateToken, feeReceiverRoutes);
app.use("/api/meetings", authenticateToken, meetingRoutes);
app.use("/api/profile", authenticateToken, require("./src/profile/route/profileRoutes"));
app.use("/api/notifications", authenticateToken, notificationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/report",authenticateToken, require("./src/report/route/reportRoutes"));
app.use("/api/term", authenticateToken, require("./src/term/route/termRoutes"));
app.use("/api/chapter-payment", authenticateToken, require("./src/chapterPayment/route/chapterPaymentRoutes"));
app.use("/api/visitor-history",authenticateToken, require("./src/visitorHistory/route/visitorHistoryRoutes"));

// admin routes
// app.use("/api/organisations", authenticateToken, require("./src/organisation/route/adminOrganisationRoutes"));
app.use("/api/admin/organisations", authenticateToken, AuthenticateAdmin, require("./src/organisation/route/adminOrganisationRoutes"));
app.use("/api/admin/chapters", require("./src/chapter/route/adminChapterRoutes"));
app.use("/api/admin/chapter-member-list", authenticateToken, AuthenticateAdmin, require("./src/chapter/route/adminChapterMemberListRoutes"));
app.use("/api/admin/members", authenticateToken, AuthenticateAdmin, require("./src/member/route/adminMemberRoutes"));

app.use("/api/*", (req, res) => {
  res.status(404).send("Not Found - Please check the URL and try again");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
