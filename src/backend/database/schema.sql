--  Create users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,  --  Add name column
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  profilePicture TEXT 
);
