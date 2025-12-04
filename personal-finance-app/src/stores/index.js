import { defineStore } from "pinia";

const STORAGE_KEY = "finance-transactions";
const JSON_SEED_PATH = "/transactions.json";

async function loadInitialData() {
  const localData = localStorage.getItem(STORAGE_KEY);

  if (localData) {
    console.log("Loading data from localStorage.");
    return JSON.parse(localData);
  }

  try {
    console.log("Loading data from default JSON seed.");
    const response = await fetch(JSON_SEED_PATH);
    const json = await response.json();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
    return json;
  } catch (error) {
    console.error("Error loading initial data:", error);
    return [];
  }
}

function saveToLocalStorage(transactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export const useTransactionStore = defineStore("transactions", {
  state: () => ({
    transactions: [],
    categories: ["Food", "Bills", "Salary", "Shopping", "Transport", "Others"],
  }),

  getters: {
    totalIncome: (state) =>
      state.transactions
        .filter((t) => t.type === "Credit")
        .reduce((sum, t) => sum + t.amount, 0),

    totalExpenses: (state) =>
      state.transactions
        .filter((t) => t.type === "Expense")
        .reduce((sum, t) => sum + t.amount, 0),

    netBalance: (state) => {
      return (
        state.transactions
          .filter((t) => t.type === "Credit")
          .reduce((sum, t) => sum + t.amount, 0) -
        state.transactions
          .filter((t) => t.type === "Expense")
          .reduce((sum, t) => sum + t.amount, 0)
      );
    },

    expenseToIncomeRatio: (state) => {
      const income = state.transactions
        .filter((t) => t.type === "Credit")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = state.transactions
        .filter((t) => t.type === "Expense")
        .reduce((sum, t) => sum + t.amount, 0);

      return income === 0 ? 0 : (expenses / income) * 100;
    },

    allCategories: (state) => state.categories,
  },

  actions: {
    async loadTransactions() {
      const tx = await loadInitialData();
      this.transactions = tx;
    },

    addTransaction(transaction) {
      const maxId = this.transactions.reduce(
        (max, t) => Math.max(max, t.id),
        0
      );
      transaction.id = maxId + 1;

      this.transactions.unshift(transaction);
      saveToLocalStorage(this.transactions);
    },

    updateTransaction(updatedTransaction) {
      const index = this.transactions.findIndex(
        (t) => t.id === updatedTransaction.id
      );

      if (index !== -1) {
        this.transactions.splice(index, 1, updatedTransaction);
        saveToLocalStorage(this.transactions);
      }
    },

    deleteTransaction(id) {
      if (!confirm("Are you sure you want to delete this transaction?")) return;

      this.transactions = this.transactions.filter((t) => t.id !== id);
      saveToLocalStorage(this.transactions);
    },

    async resetData() {
      if (
        !confirm(
          "WARNING: Resetting will delete all data and reload default dataset. Continue?"
        )
      )
        return;

      localStorage.removeItem(STORAGE_KEY);
      this.transactions = [];
      await this.loadTransactions();
    },
  },
});
