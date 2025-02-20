const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./database/database"); //  Import SQLite database
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 8080;

app.use(cors({
  origin: "http://localhost:3000",  //  Allow React frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  //  Allow common methods
  allowedHeaders: ["Content-Type", "Authorization"],  //  Allow required headers
  credentials: true  //  Allow cookies or credentials (if needed)
}));

// Handle preflight OPTIONS request
app.options("*", cors());

//  Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Origin", "http://localhost:3000"); //  Allow frontend origin
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      return res.sendStatus(200);  //  Respond to OPTIONS request
    }
    next();
  });
  
  //  Serve static files (images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//  Multer: Configure Storage for Profile Pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage });

// //  Get Profile Route (Fetch Latest Data)
app.get("/api/getProfile", (req, res) => {
    const userId = req.query.userId;
  
    db.get("SELECT name, profilePicture FROM users WHERE id = ?", [userId], (err, user) => {
      if (err) {
        console.error(" Error fetching profile:", err);
        return res.status(500).json({ message: "Failed to fetch profile" });
      }
      res.json(user);
    });
  });
  
app.post("/api/profile", upload.single("profilePicture"), (req, res) => {
    const { name, userId } = req.body;

    //  Ensure userId is properly received
    if (!userId) {
        console.error(" User ID missing in profile update request.");
        return res.status(400).json({ message: "User ID is required for updating profile." });
    }

    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

    db.get("SELECT profilePicture FROM users WHERE id = ?", [userId], (err, user) => {
        if (err) {
            console.error(" Error fetching current profile:", err);
            return res.status(500).json({ message: "Failed to update profile" });
        }

        const finalProfilePicture = profilePicture || user?.profilePicture; //  Keep old image if no new upload

        db.run(
            "UPDATE users SET name = ?, profilePicture = ? WHERE id = ?",
            [name, finalProfilePicture, userId], //  Ensure we update `id: 1` and not a new record
            function (err) {
                if (err) {
                    console.error(" Database Error:", err.message);
                    return res.status(500).json({ message: "Profile update failed" });
                }

                console.log(" Profile Updated in Database:", { id: userId, name, profilePicture: finalProfilePicture });

                res.json({
                    message: "Profile updated successfully!",
                    user: { id: userId, name, profilePicture: finalProfilePicture }
                });
            }
        );
    });
});

//  Sign-Up Route (Fixed)
app.post("/signUp", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //  Check if email already exists (Fixed without async inside db.get)
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
      if (err) {
        console.error(" Database Error:", err.message);
        return res.status(500).json({ message: "Database error" });
      }

      if (user) {
        return res.status(400).json({ message: "Email already exists" });
      }

      //  Hash password securely
      bcrypt.hash(password, 10, (hashError, hashedPassword) => {
        if (hashError) {
          console.error(" Password Hashing Error:", hashError.message);
          return res.status(500).json({ message: "Error hashing password" });
        }

        //  Insert New User
        db.run(
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
          [name, email, hashedPassword],
          function (err) {
            if (err) {
              console.error(" Sign-Up Failed:", err.message);
              return res.status(500).json({ message: "Sign-Up failed. Database error." });
            }

            console.log(" User Registered:", { id: this.lastID, name, email });
            res.status(201).json({ message: "User registered successfully!", user: { id: this.lastID, name, email } });
          }
        );
      });
    });
  } catch (error) {
    console.error(" Server Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/signIn", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) {
            console.error(" Database Error:", err.message);
            return res.status(500).json({ message: "Database error" });
        }

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        //  Ensure password validation
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        //  Ensure profilePicture URL is included in the response
        const profilePicture = user.profilePicture ? `http://localhost:8080${user.profilePicture}` : null;

        res.json({
            message: "Login successful!",
            user: { id: user.id, name: user.name, email: user.email, profilePicture },
        });
    });
});


app.post("/checkUserExists", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) {
            console.error(" Database error:", err.message);
            return res.status(500).json({ message: "Database error" });
        }

        if (user) {
            res.json({ message: "User exists" });
        } else {
            res.status(404).json({ message: "User does not exist" });
        }
    });
});



//  Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}/`));

