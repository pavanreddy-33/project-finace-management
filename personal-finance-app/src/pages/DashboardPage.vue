<template>
  <v-row class="mt-4">
    <v-col cols="12">
      <SummaryCards />
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <InsightsRow />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-card class="pa-4" elevation="3" rounded="lg">
        <v-card-title class="text-h6 font-weight-bold text-primary mb-3 pa-0">
          MONTHLY INCOME VS EXPENSE
        </v-card-title>
        <BarChart :chartData="monthlyChartData" />
      </v-card>
    </v-col>

    <v-col cols="12" md="6">
      <v-card class="pa-4" elevation="3" rounded="lg">
        <v-card-title class="text-h6 font-weight-bold text-primary mb-3 pa-0">
          EXPENSE BY CATEGORY
        </v-card-title>
        <DoughnutChart :chartData="expenseCategoryData" />
      </v-card>
    </v-col>

    <v-col cols="12" md="6">
      <v-card class="pa-4" elevation="3" rounded="lg">
        <v-card-title class="text-h6 font-weight-bold text-primary mb-3 pa-0">
          BALANCE OVER TIME
        </v-card-title>
        <LineChart :chartData="balanceOverTimeData" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from "vue";
import { useTransactionStore } from "@/stores/index.js";

import SummaryCards from "@/components/dashboard/SummaryCards.vue";
import InsightsRow from "@/components/dashboard/InsightsRow.vue";
import BarChart from "../components/charts/BarChart.vue";
import DoughnutChart from "../components/charts/DoughnutChart.vue";
import LineChart from "../components/charts/LineChart.vue";

const store = useTransactionStore();
const transactions = computed(() => store.transactions || []);

const monthlyChartData = computed(() => {
  const map = {};
  transactions.value.forEach((t) => {
    const month = t.date.substring(0, 7);
    if (!map[month]) map[month] = { month, income: 0, expense: 0 };
    if (t.type === "Credit") map[month].income += t.amount;
    else map[month].expense += t.amount;
  });
  return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
});

const expenseCategoryData = computed(() => {
  const map = {};
  transactions.value
    .filter((t) => t.type === "Expense")
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
  return Object.entries(map).map(([category, amount]) => ({
    category,
    amount,
  }));
});

const balanceOverTimeData = computed(() => {
  const monthMap = {};

  transactions.value.forEach((t) => {
    const month = t.date.substring(0, 7); // YYYY-MM

    if (!monthMap[month]) {
      monthMap[month] = { month, net: 0 };
    }

    monthMap[month].net += t.type === "Credit" ? t.amount : -t.amount;
  });

  const monthlySorted = Object.values(monthMap).sort((a, b) =>
    a.month.localeCompare(b.month)
  );

  let cumulative = 0;
  return monthlySorted.map((m) => {
    cumulative += m.net;
    return {
      month: m.month, // YYYY-MM label
      balance: cumulative,
    };
  });
});
</script>

<style scoped>
.dashboard-page {
  max-width: 1400px;
  margin: auto;
}
</style>
