const express = require("express");
const router = express.Router();
const DepositoController = require("../controllers/depositoController");

// CREATE - Buat deposito type baru
router.post("/", DepositoController.create);

// GET ALL - Ambil semua deposito types
router.get("/", DepositoController.getAll);

// GET BY ID - Ambil deposito type by ID
router.get("/:id", DepositoController.getById);

// UPDATE - Update deposito type
router.put("/:id", DepositoController.update);

// DELETE - Hapus deposito type
router.delete("/:id", DepositoController.delete);

module.exports = router;
