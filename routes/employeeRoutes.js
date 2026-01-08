const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.use(protect, isAdmin);

router.post("/", upload.single("profileImage"), createEmployee);
router.get("/", getEmployees);
router.put("/:id", upload.single("profileImage"), updateEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;
