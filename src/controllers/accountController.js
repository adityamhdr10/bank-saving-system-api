const { Account, Customer, DepositoType, Transaction } = require("../models");

class AccountController {
  /**
   * CREATE - Buat account baru
   * POST /api/accounts
   */
  static async create(req, res) {
    try {
      const { customer_id, deposito_type_id, balance } = req.body;

      // Validasi input
      if (!customer_id || !deposito_type_id) {
        return res.status(400).json({
          success: false,
          message: "customer_id and deposito_type_id are required",
        });
      }

      // Cek apakah customer ada
      const customer = await Customer.findByPk(customer_id);
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      // Cek apakah deposito type ada
      const depositoType = await DepositoType.findByPk(deposito_type_id);
      if (!depositoType) {
        return res.status(404).json({
          success: false,
          message: "Deposito type not found",
        });
      }

      const account = await Account.create({
        customer_id,
        deposito_type_id,
        balance: balance || 0,
      });

      // Ambil data lengkap dengan relasi
      const accountWithRelations = await Account.findByPk(account.id, {
        include: [
          { model: Customer, as: "customer" },
          { model: DepositoType, as: "depositoType" },
        ],
      });

      res.status(201).json({
        success: true,
        message: "Account created successfully",
        data: accountWithRelations,
      });
    } catch (error) {
      console.error("Create account error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create account",
        error: error.message,
      });
    }
  }

  /**
   * GET ALL - Ambil semua accounts
   * GET /api/accounts
   */
  static async getAll(req, res) {
    try {
      const accounts = await Account.findAll({
        include: [
          { model: Customer, as: "customer" },
          { model: DepositoType, as: "depositoType" },
        ],
        order: [["created_at", "DESC"]],
      });

      res.status(200).json({
        success: true,
        data: accounts,
      });
    } catch (error) {
      console.error("Get all accounts error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch accounts",
        error: error.message,
      });
    }
  }

  /**
   * GET BY ID - Ambil account by ID
   * GET /api/accounts/:id
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;

      const account = await Account.findByPk(id, {
        include: [
          { model: Customer, as: "customer" },
          { model: DepositoType, as: "depositoType" },
          {
            model: Transaction,
            as: "transactions",
            order: [["transaction_date", "DESC"]],
          },
        ],
      });

      if (!account) {
        return res.status(404).json({
          success: false,
          message: "Account not found",
        });
      }

      res.status(200).json({
        success: true,
        data: account,
      });
    } catch (error) {
      console.error("Get account error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch account",
        error: error.message,
      });
    }
  }

  /**
   * GET BY CUSTOMER - Ambil accounts by customer ID
   * GET /api/accounts/customer/:customerId
   */
  static async getByCustomer(req, res) {
    try {
      const { customerId } = req.params;

      // Cek apakah customer ada
      const customer = await Customer.findByPk(customerId);
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      const accounts = await Account.findAll({
        where: { customer_id: customerId },
        include: [
          { model: Customer, as: "customer" },
          { model: DepositoType, as: "depositoType" },
        ],
        order: [["created_at", "DESC"]],
      });

      res.status(200).json({
        success: true,
        data: accounts,
      });
    } catch (error) {
      console.error("Get accounts by customer error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch accounts",
        error: error.message,
      });
    }
  }

  /**
   * UPDATE - Update account
   * PUT /api/accounts/:id
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { deposito_type_id } = req.body;

      const account = await Account.findByPk(id);

      if (!account) {
        return res.status(404).json({
          success: false,
          message: "Account not found",
        });
      }

      // Jika update deposito type, validasi dulu
      if (deposito_type_id) {
        const depositoType = await DepositoType.findByPk(deposito_type_id);
        if (!depositoType) {
          return res.status(404).json({
            success: false,
            message: "Deposito type not found",
          });
        }
        await account.update({ deposito_type_id });
      }

      // Ambil data lengkap dengan relasi
      const updatedAccount = await Account.findByPk(id, {
        include: [
          { model: Customer, as: "customer" },
          { model: DepositoType, as: "depositoType" },
        ],
      });

      res.status(200).json({
        success: true,
        message: "Account updated successfully",
        data: updatedAccount,
      });
    } catch (error) {
      console.error("Update account error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update account",
        error: error.message,
      });
    }
  }

  /**
   * DELETE - Hapus account
   * DELETE /api/accounts/:id
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const account = await Account.findByPk(id);

      if (!account) {
        return res.status(404).json({
          success: false,
          message: "Account not found",
        });
      }

      // Cek apakah ada transaksi
      const transactionCount = await Transaction.count({
        where: { account_id: id },
      });

      if (transactionCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete account. Account has ${transactionCount} transaction(s). Please delete all transactions first or keep the account.`,
        });
      }

      await account.destroy();

      res.status(200).json({
        success: true,
        message: "Account deleted successfully",
      });
    } catch (error) {
      console.error("Delete account error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete account",
        error: error.message,
      });
    }
  }
}

module.exports = AccountController;
