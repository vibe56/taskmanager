const { body, validationResult } = require("express-validator");

// Runs the result check — call this after your rule arrays
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

const createRules = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ max: 200 }).withMessage("Title must be under 200 characters"),

  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"]).withMessage("Priority must be Low, Medium, or High"),

  body("dueDate")
    .optional({ nullable: true })
    .isISO8601().withMessage("dueDate must be a valid date (YYYY-MM-DD)"),
];

const updateRules = [
  body("title")
    .optional()
    .trim()
    .notEmpty().withMessage("Title cannot be empty")
    .isLength({ max: 200 }).withMessage("Title must be under 200 characters"),

  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"]).withMessage("Priority must be Low, Medium, or High"),

  body("status")
    .optional()
    .isIn(["Pending", "Completed"]).withMessage("Status must be Pending or Completed"),

  body("dueDate")
    .optional({ nullable: true })
    .isISO8601().withMessage("dueDate must be a valid date (YYYY-MM-DD)"),
];

module.exports = { validate, createRules, updateRules };
