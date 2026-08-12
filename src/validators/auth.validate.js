import { body } from "express-validator";

export const registerValidation = [

    body("fullname")
        .trim()
        .notEmpty()
        .withMessage("fullname is required")
        .bail()
        .isLength({ min: 3 })
        .withMessage("Username should be at least 3 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .bail()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")

];