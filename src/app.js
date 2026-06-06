const express = require("express");
const cors = require("cors");
const multer = require("multer");
const logRequest = require("./middlewares/logger");
const errorHandler = require("./middlewares/errHandler");
const upload = multer({ dest: "uploads/" });

const app = express();
const path = require("path");

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://cloak-decidable-buddhist.ngrok-free.dev",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(logRequest);

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  if (req.body) {
    console.log("Payload:", JSON.stringify(req.body, null, 2));
  }
  next();
});

app.use('/api/user', require("./routes/userRoute"))
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/savings", require("./routes/savingsRoutes"));
app.use("/api/expenses", require("./routes/expenses"));

// app.get("/", (req, res) => res.send("SpendWise API Engine Running"));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

app.use(errorHandler);

module.exports = app;
