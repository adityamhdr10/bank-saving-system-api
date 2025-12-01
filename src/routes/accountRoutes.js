const express = require("express");
const router = express.Router();
const AccountController = require("../controllers/accountController");

// CREATE - Buat account baru
router.post("/", AccountController.create);

// GET ALL - Ambil semua accounts
router.get("/", AccountController.getAll);

// GET BY CUSTOMER - Ambil accounts by customer ID
// Note: Harus di atas /:id agar tidak ke-catch sebagai ID
router.get("/customer/:customerId", AccountController.getByCustomer);

// GET BY ID - Ambil account by ID
router.get("/:id", AccountController.getById);

// UPDATE - Update account
router.put("/:id", AccountController.update);

// DELETE - Hapus account
router.delete("/:id", AccountController.delete);

module.exports = router;
