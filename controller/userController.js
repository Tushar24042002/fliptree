const authService = require("../service/userService");
const jwt = require("jsonwebtoken");
const { encryptData } = require("../utils/cryptoAuth");

// Register a new user
async function register(req, res) {
  const { email, password, name, mobile } = req.body;
  try {
    await authService.registerUser(email, password, name, mobile);
    res.status(201).json({success : true, message: "User registered successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success : false, error: "Failed to register user." });
  }
}

// Login an existing user
      async function login(req, res) {
        const { email, password } = req.body;
        try {
          const user = await authService.loginUser(email, password);
          const data = { userId: user.id, roleId: user.role_id };
          const encryptedData = encryptData(data);
          const token = jwt.sign({ data: encryptedData }, process.env.JWT_SECRET, { expiresIn: "12h" });
      
          res.status(200).json({success : true,
            message: "User logged in successfully.",
             token,  
          });
        } catch (error) {
          res.status(401).json({success : false, error: "Invalid email or password." + error });
        }
      }

      async function getUserData(req, res) {
        const userId = req.user.userId;
        try {
          const user = await authService.getUserData(userId);
          res.status(200).json({
            success: true,
            message: "User data received successfully.",
            data: user,
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          res.status(401).json({ success: false, error: error.message });
        }
      }


      async function getUserTransactions(req, res) {
        const userId = req.user.userId;
        const { date } = req.query;

        if (!date) {
            const currentDate = getCurrentTime();
            date = getDateFromDateTime(currentDate);
        }
        try {
          const user = await authService.getUserTransactions(userId, date);
          res.status(200).json({
            success: true,
            message: "User data received successfully.",
            data: user,
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          res.status(401).json({ success: false, error: error.message });
        }
      }
      
      
      async function getAllUsers(req, res) {
        try {
            const users = await authService.getAllUsers();
            res.status(200).json({ success: true, "data": users });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error  while fetch customers', error: error.message });
        }
    }

    async function updateUserByAdmin(req, res) {
      try {
          const users = await authService.updateUserByAdmin(req,res);
          res.status(200).json({ success: true, "data": users });
      } catch (error) {
          res.status(500).json({ success: false, message: 'Error  while fetch customers', error: error.message });
      }
  }

    
module.exports = {
  register,
  login,
  getUserData,
  getUserTransactions,
  getAllUsers,
  updateUserByAdmin
};
