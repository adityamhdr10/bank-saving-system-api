const { DepositoType, Account } = require("../models");

class DepositoController {
  /**
   * CREATE - Buat deposito type baru
   * POST /api/deposito-types
   */
  static async create(req, res) {
    try {
      const { name, yearly_return } = req.body;

      // Validasi input
      if (!name || name.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Name is required",
        });
      }

      if (!yearly_return || yearly_return <= 0) {
        return res.status(400).json({
          success: false,
          message: "Yearly return must be greater than 0",
        });
      }

      if (yearly_return > 100) {
        return res.status(400).json({
          success: false,
          message: "Yearly return cannot exceed 100%",
        });
      }

      const depositoType = await DepositoType.create({
        name: name.trim(),
        yearly_return,
      });

      res.status(201).json({
        success: true,
        message: "Deposito type created successfully",
        data: depositoType,
      });
    } catch (error) {
      console.error("Create deposito type error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create deposito type",
        error: error.message,
      });
    }
  }

  /**
   * GET ALL - Ambil semua deposito types
   * GET /api/deposito-types
   */
  static async getAll(req, res) {
    try {
      const depositoTypes = await DepositoType.findAll({
        order: [["yearly_return", "ASC"]],
      });

      res.status(200).json({
        success: true,
        data: depositoTypes,
      });
    } catch (error) {
      console.error("Get all deposito types error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch deposito types",
        error: error.message,
      });
    }
  }

  /**
   * GET BY ID - Ambil deposito type by ID
   * GET /api/deposito-types/:id
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;

      const depositoType = await DepositoType.findByPk(id);

      if (!depositoType) {
        return res.status(404).json({
          success: false,
          message: "Deposito type not found",
        });
      }

      res.status(200).json({
        success: true,
        data: depositoType,
      });
    } catch (error) {
      console.error("Get deposito type error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch deposito type",
        error: error.message,
      });
    }
  }

  /**
   * UPDATE - Update deposito type
   * PUT /api/deposito-types/:id
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, yearly_return } = req.body;

      const depositoType = await DepositoType.findByPk(id);

      if (!depositoType) {
        return res.status(404).json({
          success: false,
          message: "Deposito type not found",
        });
      }

      // Validasi input
      const updateData = {};

      if (name !== undefined) {
        if (name.trim() === "") {
          return res.status(400).json({
            success: false,
            message: "Name cannot be empty",
          });
        }
        updateData.name = name.trim();
      }

      if (yearly_return !== undefined) {
        if (yearly_return <= 0) {
          return res.status(400).json({
            success: false,
            message: "Yearly return must be greater than 0",
          });
        }
        if (yearly_return > 100) {
          return res.status(400).json({
            success: false,
            message: "Yearly return cannot exceed 100%",
          });
        }
        updateData.yearly_return = yearly_return;
      }

      await depositoType.update(updateData);

      res.status(200).json({
        success: true,
        message: "Deposito type updated successfully",
        data: depositoType,
      });
    } catch (error) {
      console.error("Update deposito type error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update deposito type",
        error: error.message,
      });
    }
  }

  /**
   * DELETE - Hapus deposito type
   * DELETE /api/deposito-types/:id
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const depositoType = await DepositoType.findByPk(id);

      if (!depositoType) {
        return res.status(404).json({
          success: false,
          message: "Deposito type not found",
        });
      }

      // Cek apakah ada account yang menggunakan deposito type ini
      const accountCount = await Account.count({
        where: { deposito_type_id: id },
      });

      if (accountCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete deposito type. ${accountCount} account(s) are using this deposito type.`,
        });
      }

      await depositoType.destroy();

      res.status(200).json({
        success: true,
        message: "Deposito type deleted successfully",
      });
    } catch (error) {
      console.error("Delete deposito type error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete deposito type",
        error: error.message,
      });
    }
  }
}

module.exports = DepositoController;
