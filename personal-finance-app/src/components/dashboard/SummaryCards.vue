<template>
  <v-row class="mb-2" dense>
    <v-col cols="12" sm="6" md="3">
      <v-card
        class="py-3 px-4 text-center hover-effect"
        elevation="3"
        rounded="lg"
        color="green-lighten-5"
      >
        <v-card-title
          class="text-subtitle-1 font-weight-regular text-success pa-0"
        >
          Total Income
        </v-card-title>
        <v-card-text class="text-h5 font-weight-bold text-success pa-0 pt-1">
          ₹{{ fmt(totalIncome) }}
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="3">
      <v-card
        class="py-3 px-4 text-center hover-effect"
        elevation="3"
        rounded="lg"
        color="red-lighten-5"
      >
        <v-card-title
          class="text-subtitle-1 font-weight-regular text-error pa-0"
        >
          Total Expense
        </v-card-title>
        <v-card-text class="text-h5 font-weight-bold text-error pa-0 pt-1">
          ₹{{ fmt(totalExpenses) }}
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="3">
      <v-card
        class="py-3 px-4 text-center hover-effect"
        elevation="3"
        rounded="lg"
        color="blue-lighten-5"
      >
        <v-card-title
          class="text-subtitle-1 font-weight-regular text-primary pa-0"
        >
          Net Balance
        </v-card-title>
        <v-card-text class="text-h5 font-weight-bold text-primary pa-0 pt-1">
          ₹{{ fmt(netBalance) }}
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="3">
      <v-card
        class="py-3 px-4 text-center hover-effect"
        elevation="3"
        rounded="lg"
        color="purple-lighten-5"
      >
        <v-card-title
          class="text-subtitle-1 font-weight-regular text-purple pa-0"
        >
          Avg Monthly Savings
        </v-card-title>
        <v-card-text class="text-h5 font-weight-bold text-purple pa-0 pt-1">
          ₹{{ fmt(avgMonthlySavings) }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from "vue";
import { useTransactionStore } from "@/stores/index.js";

const store = useTransactionStore();
const totalIncome = computed(() => store.totalIncome);
const totalExpenses = computed(() => store.totalExpenses);
const netBalance = computed(() => store.netBalance);

const avgMonthlySavings = computed(() => {
  const txs = store.transactions;
  if (!txs || txs.length === 0) return 0;

  const monthlyMap = txs.reduce((acc, t) => {
    const month = t.date.substring(0, 7); // YYYY-MM
    acc[month] = acc[month] || 0;
    acc[month] += t.type === "Credit" ? t.amount : -t.amount;
    return acc;
  }, {});

  const positives = Object.values(monthlyMap).filter((v) => v > 0);
  if (positives.length === 0) return 0;
  return positives.reduce((s, v) => s + v, 0) / positives.length;
});

const fmt = (n) => (typeof n === "number" ? n.toFixed(2) : "0.00");
</script>

<style scoped>
.hover-effect {
  transition: all 0.3s ease-in-out;
  cursor: default;
}

.hover-effect:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-3px) scale(1.01);
}
</style>
