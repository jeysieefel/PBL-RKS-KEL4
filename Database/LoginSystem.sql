CREATE DATABASE LoginSystem;

USE LoginSystem;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Fullname VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_resets (
    Email VARCHAR(100) NOT NULL,
    Token VARCHAR(32) NOT NULL,
    Expiry DATETIME NOT NULL,
    PRIMARY KEY (Email)
);