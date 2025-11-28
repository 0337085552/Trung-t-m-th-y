CREATE DATABASE IF NOT EXISTS petcare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE petcare_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','customer') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category ENUM('food','litter','cage','toy','other') NOT NULL DEFAULT 'other',
  description TEXT,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  image_url VARCHAR(500),
  stock INT NOT NULL DEFAULT 0,
  status ENUM('visible','hidden') NOT NULL DEFAULT 'visible',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  pet_name VARCHAR(255) NOT NULL,
  pet_type VARCHAR(50) NOT NULL,
  pet_breed VARCHAR(255),
  pet_weight VARCHAR(50),
  pet_age VARCHAR(50),
  service VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  note TEXT,
  status ENUM('pending','approved','cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed admin user (password: 123456)
INSERT INTO users (full_name, email, phone, password_hash, role)
VALUES (
  'Quản trị viên PetCare',
  'admin@petcare.vn',
  '',
  '$2a$10$kSYXmRBO6HDIjt0il6/t0OYaL6VLdystD5nq2WEYLRh3SeIKvIrei',
  'admin'
)
ON DUPLICATE KEY UPDATE email = email;

-- Seed sample products
INSERT INTO products (name, category, description, price, image_url, stock, status) VALUES
('Hạt cho mèo trưởng thành PetCare Adult', 'food',
 'Hạt dinh dưỡng cân đối, hỗ trợ lông mượt và hệ tiêu hóa khỏe mạnh.',
 220000, 'https://vn-test-11.slatic.net/p/4ebe6acabba0905c343fd772652672d7.jpg', 18, 'visible'),
('Hạt cho chó mini PetCare Small Breed', 'food',
 'Công thức dành cho chó giống nhỏ, hạt nhỏ dễ ăn.',
 260000, 'https://tse2.mm.bing.net/th/id/OIP.lN44R5KzbylMyo1Zq8wjQAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 20, 'visible'),
('Cát vệ sinh cho mèo siêu vón cục', 'litter',
 'Khử mùi tốt, vón cục nhanh, an toàn cho mèo.',
 145000, 'https://sunpet.vn/wp-content/uploads/2023/04/cat-tofu-1.png', 32, 'visible'),
('Balo vận chuyển thú cưng phi hành gia', 'cage',
 'Thiết kế thoáng khí, kính trong suốt cho thú cưng ngắm cảnh.',
 320000, 'https://vn-test-11.slatic.net/p/c5f41bcbd62ccfc865358a99b4a1b31f.jpg', 10, 'visible'),
('Chuồng gấp cho chó mèo', 'cage',
 'Khung thép chắc chắn, gấp gọn tiện lợi.',
 450000, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1dvx9ospkpoad', 8, 'visible'),
('Đồ chơi bóng phát sáng cho chó', 'toy',
 'Chất liệu an toàn, phát sáng khi cắn, kích thích vận động.',
 85000, 'https://www.senpetshop.com/upload/images/%C4%91%E1%BB%93%20ch%C6%A1i%20m%C3%A8o/do-choi-cho-cho-xuong-vai1.jpg', 40, 'visible'),
('Vòng cổ kèm chuông cho mèo', 'toy',
 'Thiết kế dễ thương, có chuông nhỏ xinh.',
 55000, 'https://down-vn.img.susercontent.com/file/2dd515994cfd582da8ee5ec7d0e56d7f', 60, 'visible'),
('Nệm nằm êm ái cho thú cưng', 'toy',
 'Vải mềm, dễ giặt, cho thú cưng giấc ngủ ngon.',
 190000, 'https://images.pexels.com/photos/7210274/pexels-photo-7210274.jpeg?auto=compress&cs=tinysrgb&w=800', 15, 'visible');
 SELECT * FROM users;
