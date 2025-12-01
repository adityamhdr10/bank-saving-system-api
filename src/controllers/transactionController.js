const { Transaction, Account, DepositoType } = require("../models");
const BalanceCalculator = require("../services/balanceCalculator");
const { sequelize } = require("../config/db");

class TransactionController {
  /**
   * Helper: Validasi format tanggal
   */
  static validateDate(dateString) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      return { valid: false, message: "Date must be in YYYY-MM-DD format" };
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return { valid: false, message: "Invalid date" };
    }

    return { valid: true };
  }

  /**
   * DEPOSIT - Menambah saldo ke account
   * POST /api/transactions/deposit
   */
  static async deposit(req, res) {
    const t = await sequelize.transaction();

    try {
      const { account_id, amount, transaction_date } = req.body;

      // Validasi input
      if (!account_id || !amount || !transaction_date) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "account_id, amount, and transaction_date are required",
        });
      }

      // Validasi format tanggal
      const dateValidation =
        TransactionController.validateDate(transaction_date);
      if (!dateValidation.valid) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: dateValidation.message,
        });
      }

      if (amount <= 0) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "Amount must be greater than 0",
        });
      }

      // Cari account
      const account = await Account.findByPk(account_id, { transaction: t });

      if (!account) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Account not found",
        });
      }

      const balanceBefore = parseFloat(account.balance);
      const balanceAfter = balanceBefore + parseFloat(amount);

      // Update balance account
      await account.update({ balance: balanceAfter }, { transaction: t });

      // Buat transaction record
      const transaction = await Transaction.create(
        {
          account_id,
          type: "deposit",
          amount: parseFloat(amount),
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          transaction_date,
          interest_earned: 0,
          months_held: 0,
        },
        { transaction: t }
      );

      await t.commit();

      res.status(201).json({
        success: true,
        message: "Deposit successful",
        data: {
          transaction: transaction.toJSON(),
          account: {
            id: account.id,
            balance: balanceAfter,
          },
        },
      });
    } catch (error) {
      await t.rollback();
      console.error("Deposit error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process deposit",
        error: error.message,
      });
    }
  }

  /**
   * WITHDRAW - Mengurangi saldo dari account dengan perhitungan bunga
   * POST /api/transactions/withdraw
   */
  static async withdraw(req, res) {
    const t = await sequelize.transaction();

    try {
      const { account_id, amount, transaction_date } = req.body;

      // Validasi input
      if (!account_id || !amount || !transaction_date) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "account_id, amount, and transaction_date are required",
        });
      }

      // Validasi format tanggal
      const dateValidation =
        TransactionController.validateDate(transaction_date);
      if (!dateValidation.valid) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: dateValidation.message,
        });
      }

      if (amount <= 0) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "Amount must be greater than 0",
        });
      }

      // Cari account dengan relasi deposito type
      const account = await Account.findByPk(account_id, {
        include: [
          {
            model: DepositoType,
            as: "depositoType",
          },
        ],
        transaction: t,
      });

      if (!account) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Account not found",
        });
      }

      // Cari transaksi deposit terakhir untuk account ini
      const lastDeposit = await Transaction.findOne({
        where: {
          account_id,
          type: "deposit",
        },
        order: [["transaction_date", "DESC"]],
        transaction: t,
      });

      if (!lastDeposit) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "No deposit found for this account. Please deposit first.",
        });
      }

      const balanceBefore = parseFloat(account.balance);
      const yearlyReturn = parseFloat(account.depositoType.yearly_return);

      // Hitung bunga
      const calculation = BalanceCalculator.calculateWithdrawBalance(
        balanceBefore,
        yearlyReturn,
        lastDeposit.transaction_date,
        transaction_date
      );

      // Validasi saldo cukup
      if (
        !BalanceCalculator.hasSufficientBalance(
          calculation.endingBalance,
          amount
        )
      ) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "Insufficient balance",
          data: {
            available_balance: calculation.endingBalance,
            requested_amount: parseFloat(amount),
          },
        });
      }

      const balanceAfter = calculation.endingBalance - parseFloat(amount);

      // Update balance account (balance setelah dikurangi withdraw)
      await account.update({ balance: balanceAfter }, { transaction: t });

      // Buat transaction record
      const transaction = await Transaction.create(
        {
          account_id,
          type: "withdraw",
          amount: parseFloat(amount),
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          transaction_date,
          interest_earned: calculation.interestEarned,
          months_held: calculation.monthsHeld,
        },
        { transaction: t }
      );

      await t.commit();

      res.status(200).json({
        success: true,
        message: "Withdrawal successful",
        data: {
          transaction: transaction.toJSON(),
          calculation: {
            balance_before: calculation.startingBalance,
            months_held: calculation.monthsHeld,
            yearly_return: calculation.yearlyReturn,
            monthly_return: calculation.monthlyReturn,
            interest_earned: calculation.interestEarned,
            balance_with_interest: calculation.endingBalance,
            withdraw_amount: parseFloat(amount),
            balance_after: balanceAfter,
          },
          account: {
            id: account.id,
            balance: balanceAfter,
          },
        },
      });
    } catch (error) {
      await t.rollback();
      console.error("Withdraw error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process withdrawal",
        error: error.message,
      });
    }
  }

  /**
   * GET TRANSACTION HISTORY by account
   * GET /api/transactions/account/:accountId
   */
  static async getByAccount(req, res) {
    try {
      const { accountId } = req.params;

      const transactions = await Transaction.findAll({
        where: { account_id: accountId },
        order: [
          ["transaction_date", "DESC"],
          ["created_at", "DESC"],
        ],
      });

      res.status(200).json({
        success: true,
        data: transactions,
      });
    } catch (error) {
      console.error("Get transactions error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch transactions",
        error: error.message,
      });
    }
  }
}

module.exports = TransactionController;
