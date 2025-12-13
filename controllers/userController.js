const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// REGISTER USER
exports.createUser = async (req, res) => {
  try {
    const { fullName, email, phone, password, dateOfBirth, gender, termsAccepted } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Full name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    // Backend email validation
    const allowedDomains = ["hotmail.com", "gmail.com", "utas.edu.om"];
    const emailDomain = email.split("@")[1];

    if (!allowedDomains.includes(emailDomain)) {
      return res.status(400).json({ message: "Email must be from hotmail.com, gmail.com, or utas.edu.om" });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Phone validation
    if (!/^[97]\d{7}$/.test(phone)) {
      return res.status(400).json({ message: "Phone number must be 8 digits and start with 9 or 7" });
    }

    // validate age (e.g., user must be 13+)
    if (dateOfBirth) {
      const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
      if (age < 13) {
        return res.status(400).json({ message: "You must be at least 13 years old" });
      }
    }


    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
      dateOfBirth,
      gender,
      termsAccepted,
      role: "user",
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "30d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    console.log("Deleting user with ID:", req.params.id); 
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err); 
    res.status(500).json({ message: "Failed to delete user" });
  }
};


// CREATE ADMIN (SEPARATE, CORRECT PLACE)
exports.createAdmin = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const hashedPass = await bcrypt.hash(password, 12);

    const admin = new User({
      fullName,
      email,
      password: hashedPass,
      role: "admin"
    });

    await admin.save();
    res.json({ message: "Admin created", admin });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
