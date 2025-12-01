USE bank_saving_system;

-- ============================================
-- SEED DATA: deposito_types
-- ============================================
INSERT INTO deposito_types (name, yearly_return) VALUES
('Deposito Bronze', 3.00),
('Deposito Silver', 5.00),
('Deposito Gold', 7.00);

-- ============================================
-- SEED DATA: customers (optional)
-- ============================================
INSERT INTO customers (name) VALUES
('John Doe'),
('Jane Smith'),
('Robert Johnson');

-- ============================================
-- SEED DATA: accounts (optional)
-- ============================================
INSERT INTO accounts (customer_id, deposito_type_id, balance) VALUES
(1, 1, 1000000.00),  -- John dengan Bronze
(1, 2, 5000000.00),  -- John dengan Silver (customer bisa punya banyak akun)
(2, 3, 10000000.00); -- Jane dengan Gold