const { Customer, Account, DepositoType } = require("../models");

class CustomerController {
  /**
   * CREATE - Buat customer baru
   * POST /api/customers
   */
  static async create(req, res) {
    try {
      const { name } = req.body;

      if (!name || name.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Name is required",
        });
      }

      const customer = await Customer.create({ name: name.trim() });

      res.status(201).json({
        success: true,
        message: "Customer created successfully",
        data: customer,
      });
    } catch (error) {
      console.error("Create customer error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create customer",
        error: error.message,
      });
    }
  }

  /**
   * GET ALL - Ambil semua customers
   * GET /api/customers
   */
  static async getAll(req, res) {
    try {
      const customers = await Customer.findAll({
        include: [
          {
            model: Account,
            as: "accounts",
            include: [
              {
                model: DepositoType,
                as: "depositoType",
              },
            ],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      res.status(200).json({
        success: true,
        data: customers,
      });
    } catch (error) {
      console.error("Get all customers error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch customers",
        error: error.message,
      });
    }
  }

  /**
   * GET BY ID - Ambil customer by ID
   * GET /api/customers/:id
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;

      const customer = await Customer.findByPk(id, {
        include: [
          {
            model: Account,
            as: "accounts",
            include: [
              {
                model: DepositoType,
                as: "depositoType",
              },
            ],
          },
        ],
      });

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      console.error("Get customer error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch customer",
        error: error.message,
      });
    }
  }

  /**
   * UPDATE - Update customer
   * PUT /api/customers/:id
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name || name.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Name is required",
        });
      }

      const customer = await Customer.findByPk(id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      await customer.update({ name: name.trim() });

      res.status(200).json({
        success: true,
        message: "Customer updated successfully",
        data: customer,
      });
    } catch (error) {
      console.error("Update customer error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update customer",
        error: error.message,
      });
    }
  }

  /**
   * DELETE - Hapus customer
   * DELETE /api/customers/:id
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const customer = await Customer.findByPk(id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      // Cek apakah customer punya account
      const accountCount = await Account.count({ where: { customer_id: id } });

      if (accountCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete customer. Customer has ${accountCount} active account(s). Please delete all accounts first.`,
        });
      }

      await customer.destroy();

      res.status(200).json({
        success: true,
        message: "Customer deleted successfully",
      });
    } catch (error) {
      console.error("Delete customer error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete customer",
        error: error.message,
      });
    }
  }
}

module.exports = CustomerController;
