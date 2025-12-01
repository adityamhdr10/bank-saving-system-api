const express = require("express");
const router = express.Router();
const TransactionController = require("../controllers/transactionController");

// DEPOSIT - Tambah saldo
router.post("/deposit", TransactionController.deposit);

// WITHDRAW - Tarik saldo dengan perhitungan bunga
router.post("/withdraw", TransactionController.withdraw);

// GET TRANSACTION HISTORY - By account ID
router.get("/account/:accountId", TransactionController.getByAccount);

module.exports = router;
