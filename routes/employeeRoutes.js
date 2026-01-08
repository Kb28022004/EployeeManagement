const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload"); 

const {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeDashboardData,
  getEmployeeById,
} = require("../controllers/employeeController");

const router = express.Router();

/* ================= ADMIN PROTECTED ROUTES ================= */

router.use(protect, isAdmin);

/* ---------- CREATE EMPLOYEE ---------- */
router.post("/", upload.single("profileImage"), createEmployee);

/* ---------- GET ALL EMPLOYEES ---------- */
router.get("/", getEmployees);

/* ---------- DASHBOARD DATA ---------- */
router.get("/dashboard", getEmployeeDashboardData);

/* ---------- UPDATE EMPLOYEE ---------- */
router.put("/:id", upload.single("profileImage"), updateEmployee);

/* ---------- DELETE EMPLOYEE ---------- */
router.delete("/:id", deleteEmployee);

/* ---------- GET EMPLOYEE BY ID ---------- */
router.get("/:id", getEmployeeById);

module.exports = router;
