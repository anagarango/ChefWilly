-- CREATE DATABASE fictichat IF NOT EXISTS;
-- use fictichat;

CREATE TABLE user(
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(200),
  email VARCHAR(200),
  password VARCHAR(400),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- describe user;

CREATE TABLE ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  ingredient_id INT,
  ingredient_name VARCHAR(200),
  aisle VARCHAR(200),
  image VARCHAR(200),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE cookbook (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  recipe_id INT,
  recipe_information TEXT,
  FOREIGN KEY (user_id) REFERENCES user(id)
);

-- describe user;