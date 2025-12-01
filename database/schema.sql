-- Hapus database jika sudah ada (optional, untuk fresh install)
DROP DATABASE IF EXISTS bank_saving_system;

-- Buat database baru
CREATE DATABASE bank_saving_system;

-- Gunakan database
USE bank_saving_system;

-- ============================================
-- TABLE: customers
-- ============================================
CREATE TABLE customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: deposito_types
-- ============================================
CREATE TABLE deposito_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  yearly_return DECIMAL(5,2) NOT NULL COMMENT 'Dalam persen, contoh: 3.00 untuk 3%',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: accounts
-- ============================================
CREATE TABLE accounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  deposito_type_id INT NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (deposito_type_id) REFERENCES deposito_types(id)
);

-- ============================================
-- TABLE: transactions
-- ============================================
CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  account_id INT NOT NULL,
  type ENUM('deposit', 'withdraw') NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  balance_before DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2) NOT NULL,
  transaction_date DATE NOT NULL,
  interest_earned DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Bunga yang didapat saat withdraw',
  months_held INT DEFAULT 0 COMMENT 'Berapa bulan uang disimpan',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- ============================================
-- INDEXES untuk performa query
-- ============================================
CREATE INDEX idx_accounts_customer ON accounts(customer_id);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);