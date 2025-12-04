<template>
  <v-row class="mb-4" dense>
    <v-col cols="12" md="4">
      <v-card class="pa-4 text-center" elevation="3" rounded="lg">
        <v-card-title class="text-subtitle-1 font-weight-medium pa-0">
          Highest Expense Category:
        </v-card-title>
        <v-card-text class="text-h6 font-weight-bold text-error pa-0 pt-1">
          {{ highestExpenseCategory }}
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card class="pa-4 text-center" elevation="3" rounded="lg">
        <v-card-title class="text-subtitle-1 font-weight-medium pa-0">
          Avg Monthly Saving:
        </v-card-title>
        <v-card-text class="text-h6 font-weight-bold text-success pa-0 pt-1">
          ₹{{ fmt(avgMonthlySavings) }}
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card class="pa-4 text-center" elevation="3" rounded="lg">
        <v-card-title class="text-subtitle-1 font-weight-medium pa-0">
          Total Transactions:
        </v-card-title>
        <v-card-text class="text-h6 font-weight-bold text-primary pa-0 pt-1">
          {{ totalTransactions }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from "vue";
import { useTransactionStore } from "@/stores/index.js";

const store = useTransactionStore();
const transactions = computed(() => store.transactions || []);

const expenseCategoryData = computed(() => {
  const map = {};
  transactions.value.forEach((t) => {
    if (t.type === "Expense")
      map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map).map(([category, amount]) => ({
    category,
    amount,
  }));
});

const highestExpenseCategory = computed(() => {
  const arr = expenseCategoryData.value;
  if (!arr.length) return "N/A";
  const max = arr.reduce((m, cur) => (cur.amount > m.amount ? cur : m), {
    category: "N/A",
    amount: -1,
  });
  return max.category;
});

const totalTransactions = computed(() => transactions.value.length);

const avgMonthlySavings = computed(() => {
  if (!transactions.value.length) return 0;
  const monthly = transactions.value.reduce((acc, t) => {
    const m = t.date.substring(0, 7);
    acc[m] = (acc[m] || 0) + (t.type === "Credit" ? t.amount : -t.amount);
    return acc;
  }, {});
  const positives = Object.values(monthly).filter((v) => v > 0);
  if (!positives.length) return 0;
  return positives.reduce((s, v) => s + v, 0) / positives.length;
});

const fmt = (n) => (typeof n === "number" ? n.toFixed(2) : "0.00");
</script>
