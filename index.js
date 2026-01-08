const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const ConnectDb = require("./config/db");
const AuthRouter = require("./routes/authRoutes");
const EmployeeRouter = require("./routes/employeeRoutes");

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("API is running");
});


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://yourdomain.com",
      "https://www.yourdomain.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE","PATCH","OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.use(express.json());

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/employees", EmployeeRouter);
app.use("/uploads", express.static("uploads"));


const PORT = process.env.PORT || 8000;

const start = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined");
    }

    await ConnectDb(process.env.MONGO_URL);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server start error:", error);
    process.exit(1);
  }
};

start();

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  process.exit(0);
});
