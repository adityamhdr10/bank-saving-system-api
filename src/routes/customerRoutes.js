const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customerController");

// CREATE - Buat customer baru
router.post("/", CustomerController.create);

// GET ALL - Ambil semua customers
router.get("/", CustomerController.getAll);

// GET BY ID - Ambil customer by ID
router.get("/:id", CustomerController.getById);

// UPDATE - Update customer
router.put("/:id", CustomerController.update);

// DELETE - Hapus customer
router.delete("/:id", CustomerController.delete);

module.exports = router;
