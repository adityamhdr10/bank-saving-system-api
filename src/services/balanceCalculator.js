/**
 * Menghitung bunga deposito berdasarkan:
 * - Saldo awal
 * - Bunga tahunan (yearly return)
 * - Lama waktu dalam bulan
 */
class BalanceCalculator {
  /**
   * Hitung selisih bulan antara 2 tanggal
   * @param {Date} startDate - Tanggal mulai
   * @param {Date} endDate - Tanggal akhir
   * @returns {number} Jumlah bulan
   */
  static calculateMonthsDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validasi date
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format");
    }

    const yearsDiff = end.getFullYear() - start.getFullYear();
    const monthsDiff = end.getMonth() - start.getMonth();

    return yearsDiff * 12 + monthsDiff;
  }

  /**
   * Hitung bunga yang didapat
   * Formula: starting_balance * monthly_return * months
   * @param {number} startingBalance - Saldo awal
   * @param {number} yearlyReturn - Bunga tahunan dalam persen (misal: 5.00 untuk 5%)
   * @param {number} months - Jumlah bulan
   * @returns {Object} Detail kalkulasi
   */
  static calculateInterest(startingBalance, yearlyReturn, months) {
    // Validasi input
    if (startingBalance < 0) {
      throw new Error("Starting balance cannot be negative");
    }
    if (yearlyReturn < 0 || yearlyReturn > 100) {
      throw new Error("Yearly return must be between 0 and 100");
    }
    if (months < 0) {
      throw new Error("Months cannot be negative");
    }

    // Konversi yearly return ke monthly return (desimal)
    // Misal: 5% per tahun = 5/12/100 = 0.004167 per bulan
    const monthlyReturn = yearlyReturn / 12 / 100;

    // Hitung bunga
    const interestEarned = startingBalance * monthlyReturn * months;

    // Saldo akhir
    const endingBalance = startingBalance + interestEarned;

    return {
      startingBalance: parseFloat(startingBalance),
      yearlyReturn: parseFloat(yearlyReturn),
      monthlyReturn: parseFloat(monthlyReturn.toFixed(6)),
      monthsHeld: months,
      interestEarned: parseFloat(interestEarned.toFixed(2)),
      endingBalance: parseFloat(endingBalance.toFixed(2)),
    };
  }

  /**
   * Validasi apakah saldo cukup untuk withdraw
   * @param {number} currentBalance - Saldo saat ini
   * @param {number} withdrawAmount - Jumlah yang mau ditarik
   * @returns {boolean}
   */
  static hasSufficientBalance(currentBalance, withdrawAmount) {
    return parseFloat(currentBalance) >= parseFloat(withdrawAmount);
  }

  /**
   * Hitung ending balance untuk withdraw
   * Ini yang akan ditampilkan ke customer
   * @param {number} startingBalance - Saldo awal
   * @param {number} yearlyReturn - Bunga tahunan
   * @param {Date} depositDate - Tanggal deposit terakhir
   * @param {Date} withdrawDate - Tanggal withdraw
   * @returns {Object} Detail kalkulasi lengkap
   */
  static calculateWithdrawBalance(
    startingBalance,
    yearlyReturn,
    depositDate,
    withdrawDate
  ) {
    const months = this.calculateMonthsDifference(depositDate, withdrawDate);

    // Validasi: tidak bisa withdraw sebelum deposit
    if (months < 0) {
      throw new Error("Withdrawal date cannot be before deposit date");
    }

    return this.calculateInterest(startingBalance, yearlyReturn, months);
  }
}

module.exports = BalanceCalculator;
