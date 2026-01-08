const Employee = require("../models/Employee");

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

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    console.error("Create employee error:", error);
    res.status(500).json({
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

    if (status) {
      filter.isActive = status === "active";
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [employees, total] = await Promise.all([
      Employee.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Employee.countDocuments(filter),
    ]);

    res.status(200).json({
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
    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
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
    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    console.error("Update employee error:", error);
    res.status(500).json({
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
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Delete employee error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete employee",
    });
  }
};

exports.getEmployeeDashboardData = async (req, res) => {
  try {
    const employee = await Employee.find();
    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "There is no employee found",
      });
    }

    // total number of employees
    const totalEmployees = employee.length;

    // list of all employees which is active
    const ActiveEmployees = employee.filter(
      (curEmpl) => curEmpl.isActive === true
    );

    // count of acitve employees
    const totalActiveEmployees = ActiveEmployees.length;

    // list of all employees which is inactive
    const inActiveEmployees = employee.filter(
      (curEmpl) => curEmpl.isActive === false
    );

    // count of acitve employees
    const totalInActiveEmployees = inActiveEmployees.length;

    res.status(200).json({
      success: true,
      dashboardData: {
        totalEmployees,
        totalActiveEmployees,
        totalInActiveEmployees,
      },
    });
  } catch (error) {
    console.error("Something Went Wrong, Please try again leter:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load data",
    });
  }
};
