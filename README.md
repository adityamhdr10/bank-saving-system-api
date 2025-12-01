# 🏦 Bank Saving System API

REST API untuk sistem tabungan bank dengan perhitungan bunga deposito.

## 📋 Features

- **Customer Management** - CRUD operations untuk data customer
- **Account Management** - CRUD operations untuk rekening tabungan
- **Deposito Type Management** - Kelola tipe deposito dengan bunga berbeda
- **Transaction Processing** - Deposit & Withdraw dengan perhitungan bunga otomatis
- **Interest Calculation** - Perhitungan bunga deposito berdasarkan waktu

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Security**: Helmet, Rate Limiting
- **Deployment**: Railway

## 📦 Installation

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd bank-saving-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
```

Edit file `.env` dengan kredensial database Anda:
```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bank_saving_db
DB_USER=root
DB_PASSWORD=your_password
DB_SSL=false
```

### 4. Create Database
```bash
# Buat database di MySQL
mysql -u root -p
CREATE DATABASE bank_saving_db;
```

### 5. Run Migration
```bash
npm run migrate
```

### 6. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

Server akan berjalan di `http://localhost:3000`

## 🚀 API Endpoints

### Health Check
```
GET /
```

### Customers
```
POST   /api/customers          - Create customer
GET    /api/customers          - Get all customers
GET    /api/customers/:id      - Get customer by ID
PUT    /api/customers/:id      - Update customer
DELETE /api/customers/:id      - Delete customer
```

### Accounts
```
POST   /api/accounts                    - Create account
GET    /api/accounts                    - Get all accounts
GET    /api/accounts/:id                - Get account by ID
GET    /api/accounts/customer/:customerId - Get accounts by customer
PUT    /api/accounts/:id                - Update account
DELETE /api/accounts/:id                - Delete account
```

### Deposito Types
```
POST   /api/deposito-types     - Create deposito type
GET    /api/deposito-types     - Get all deposito types
GET    /api/deposito-types/:id - Get deposito type by ID
PUT    /api/deposito-types/:id - Update deposito type
DELETE /api/deposito-types/:id - Delete deposito type
```

### Transactions
```
POST   /api/transactions/deposit           - Deposit money
POST   /api/transactions/withdraw          - Withdraw money (with interest)
GET    /api/transactions/account/:accountId - Get transaction history
```

## 📝 API Usage Examples

### 1. Create Customer
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe"}'
```

### 2. Create Deposito Type
```bash
curl -X POST http://localhost:3000/api/deposito-types \
  -H "Content-Type: application/json" \
  -d '{"name": "Deposito 6 Bulan", "yearly_return": 5.5}'
```

### 3. Create Account
```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "deposito_type_id": 1,
    "balance": 0
  }'
```

### 4. Deposit
```bash
curl -X POST http://localhost:3000/api/transactions/deposit \
  -H "Content-Type: application/json" \
  -d '{
    "account_id": 1,
    "amount": 10000000,
    "transaction_date": "2024-01-01"
  }'
```

### 5. Withdraw (dengan bunga)
```bash
curl -X POST http://localhost:3000/api/transactions/withdraw \
  -H "Content-Type: application/json" \
  -d '{
    "account_id": 1,
    "amount": 5000000,
    "transaction_date": "2024-07-01"
  }'
```

## 🧮 Interest Calculation

Sistem menggunakan rumus:
```
Monthly Return = Yearly Return / 12 / 100
Interest = Balance × Monthly Return × Months
Final Balance = Balance + Interest
```

**Contoh:**
- Saldo: Rp 10.000.000
- Bunga tahunan: 6%
- Lama: 6 bulan
- Bunga bulanan: 6/12/100 = 0.005
- Bunga didapat: 10.000.000 × 0.005 × 6 = Rp 300.000
- Saldo akhir: Rp 10.300.000

## 🔒 Security Features

- **Helmet** - Security headers
- **Rate Limiting** - Max 100 requests per 15 menit
- **CORS** - Cross-Origin Resource Sharing enabled
- **Input Validation** - Validasi semua input
- **SQL Injection Protection** - Via Sequelize ORM

## 🌐 Deployment (Railway)

Project ini sudah siap deploy ke Railway.

### Environment Variables untuk Production:
```
NODE_ENV=production
PORT=3000
DB_HOST=<railway-mysql-host>
DB_PORT=3306
DB_NAME=railway
DB_USER=root
DB_PASSWORD=<railway-mysql-password>
DB_SSL=true
```

## 📄 License

MIT

## 👤 Author

Aditya Mahendra
