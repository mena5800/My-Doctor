const User = require("../models/user");
const sha256 = require("js-sha256");
const roles = require("../utils/userRoles");

function capitalizeFirstLetter(str) {
  if (!str) return str; // Check if the string is empty or undefined
  return str.charAt(0).toUpperCase() + str.slice(1);
}

class UserController {

  static async registerUser(req, res) {
    try {
      let { email, role } = req.body;
      role = capitalizeFirstLetter(role);
      req.body.role = role;
  
      // Check if the email is already registered
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ error: "This email is registered before" });
      }
  
      // Validate role
      if (!roles[role]) {
        return res.status(400).json({ error: "Invalid role specified" });
      }
  
      // Create and save the new user
      const newUser = new roles[role](req.body);
      const result = await newUser.save();
  
      // Set session
      const userId = result._id;
      req.session.user = { email, userId, role };
      console.log(req.session.user)
      // Return a successful response
      return res.status(201).json({ message: "Successfully signed up. Token generated" });
  
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ error: "Email Already Exists" });
      } else if (err.errors && typeof err.errors === 'object') {
        const errorMessages = Object.values(err.errors).map(
          (error) => error.properties.message || "Unknown validation error"
        );
        return res.status(400).json({ error: errorMessages });
      }
  
      return res.status(500).json({ error: "Internal Error" });
    }
  }

  static async logInUser(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Missing Email" });
    }
    if (!password) {
      return res.status(400).json({ error: "Missing Password" });
    }
    let user = await User.findOne({ email, password: sha256(password) });

    if (!user) {
      // redirect to this login page
      return res.status(401).json({ error: "Email or Password Incorrect" });
    }
    let role = user.role;
    let userId = user.id;
    req.session.user = { email, userId, role};
    const responceObj = {message: "Successfully login. Token Generated", role, email, userId};
    return res.status(200).json(responceObj);
  }

  static async currentUser(req, res) {
    const email = req.session.user.email;
    if (!email) {
      return res.status(400).json({ error: 'Missing Email' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User does not exists' });
    }
    return res.status(200).send(`Welcome back ${req.session.user.role} ${req.session.user.email}`);
  }

  // For Administrators only
  // static async getAllUsers(req, res) {
  //   if (!(req.session.user.email === process.env.EMAIL)) {
  //     return res.status(403).json({ error: "Forbidden" });
  //   }
  //   await User.find()
  //     .then((allUsers) => res.status(200).send(allUsers))
  //     .catch(() => res.status(500).json({ error: "Internal Error" }));
  // }

  static async getProfile(req, res) {
    try {
        const userId = req.session.user.userId; // Assume email is passed as query parameter
        const profile = await User.findById(userId).select('-password').lean();
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        
        return res.status(200).json(profile);
    } catch (err) {
        console.error('Error fetching profile:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

static async updateProfile(req, res) {
  try {
      const userId = req.session.user.userId;
      // Update the user's profile
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true }).select('-password').lean();

      if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(updatedUser);
  } catch (err) {
      console.error('Error updating profile:', err);
      return res.status(500).json({ error: 'Internal server error' });
  }
}

static async checkSession(req, res) {
  if (req.session && req.session.user) {
    // Session exists, return user data
    return res.status(200).json(req.session.user);
  } else {
    // No valid session
    return res.status(401).json({ error: "No valid session" });
  }
}

static async deleteUser(req, res) {
  try {
    const userId = req.session.user.userId;

    const response = await User.findByIdAndDelete(userId);

    if (!response) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optionally, you can clear the session after deleting the user
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "User deleted, but session could not be destroyed" });
      }
      return res.status(200).json({ message: "User deleted successfully" });
    });

  } catch (error) {
    return res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
}

}




module.exports = UserController;
