const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// The register function to handle new user registration
exports.register = async (req, res) => {
  // Use a try...catch block for robust error handling
  try {
    // 1. Destructure the required fields from the request body
    const { full_name, user_id, email, password } = req.body;

    // 2. Perform basic validation to ensure all fields are provided
    if (!full_name || !user_id || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    // 3. Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "A user with this email already exists." });
    }

    // 4. Hash the password before saving it to the database
    // We use a salt round of 10, which is a good balance between security and performance.
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 5. Create a new User instance with the hashed password
    const newUser = new User({
      full_name,
      user_id,
      email,
      password: hashedPassword,
    });

    // 6. Save the new user to the database
    await newUser.save();

    // 7. Send a successful response
    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        full_name: newUser.full_name,
        email: newUser.email,
        user_id: newUser.user_id,
      },
    });
  } catch (error) {
    // Log the error for debugging and send a generic server error message
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
