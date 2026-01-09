const Employee = require("../models/Employee");
const mongoose = require("mongoose");

/* ================= HELPER ================= */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @desc    Create new employee (Admin only)
 * @route   POST /api/employees
 * @access  Admin
 */
exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create({
      ...req.body,
      profileImage: req.file?.filename || null,
      employeeId: `EMP-${Date.now()}`,
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    console.error("Create employee error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create employee",
    });
  }
};

/**
 * @desc    Get all employees with pagination, search & filters
 * @route   GET /api/employees
 * @access  Admin
 */
exports.getEmployees = async (req, res) => {
  try {
    const { search, gender, status, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (search) {
      filter.fullName = { $regex: search, $options: "i" };
    }

    if (gender) {
      filter.gender = gender;
    }

    if (status !== undefined) {
      filter.isActive = status === "true";
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [employees, total] = await Promise.all([
      Employee.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Employee.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      data: employees,
      pagination: {
        totalRecords: total,
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Get employees error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
    });
  }
};


/**
 * @desc    Get employee by ID
 * @route   GET /api/employees/:id
 * @access  Admin
 */
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("Get employee by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch employee",
    });
  }
};

/**
 * @desc    Update employee details
 * @route   PUT /api/employees/:id
 * @access  Admin
 */
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    const updateData = { ...req.body };

    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const employee = await Employee.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    console.error("Update employee error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update employee",
    });
  }
};

/**
 * @desc    Delete employee
 * @route   DELETE /api/employees/:id
 * @access  Admin
 */
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Delete employee error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete employee",
    });
  }
};

/**
 * @desc    Employee dashboard data
 * @route   GET /api/employees/dashboard
 * @access  Admin
 */
exports.getEmployeeDashboardData = async (req, res) => {
  try {
    const employees = await Employee.find({}, { isActive: 1 });

    const totalEmployees = employees.length;
    const totalActiveEmployees = employees.filter(
      (emp) => emp.isActive
    ).length;
    const totalInActiveEmployees = totalEmployees - totalActiveEmployees;

    return res.status(200).json({
      success: true,
      dashboardData: {
        totalEmployees,
        totalActiveEmployees,
        totalInActiveEmployees,
      },
    });
  } catch (error) {
    console.error("Dashboard data error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};
