CREATE TABLE users (
    id UUID PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    avatar TEXT,
    bio TEXT,
    created_at TIMESTAMP
);

CREATE TABLE posts (
    id UUID PRIMARY KEY,
    author_id UUID,
    content TEXT,
    created_at TIMESTAMP
);

CREATE TABLE comments (
    id UUID PRIMARY KEY,
    post_id UUID,
    author_id UUID,
    content TEXT
);

CREATE TABLE likes (
    id UUID PRIMARY KEY,
    post_id UUID,
    user_id UUID
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  wallet_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
