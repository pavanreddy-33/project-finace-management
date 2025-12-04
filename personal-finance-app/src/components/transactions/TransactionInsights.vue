<template>
  <v-row dense class="summary-cards mt-5">
    <v-col cols="12" sm="6" md="3">
      <v-card
        class="py-3 px-4 text-center rounded-lg hover-effect"
        elevation="3"
        color="green-lighten-5"
      >
        <v-card-title
          class="text-subtitle-1 font-weight-regular text-success pa-0"
        >
          Total Income
        </v-card-title>
        <v-card-text class="text-h5 font-weight-bold text-success pa-0 pt-1">
          ₹{{ totalIncome.toFixed(2) }}
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="3">
      <v-card
        class="py-3 px-4 text-center rounded-lg hover-effect"
        elevation="3"
        color="red-lighten-5"
      >
        <v-card-title
          class="text-subtitle-1 font-weight-regular text-error pa-0"
        >
          Total Expense
        </v-card-title>
        <v-card-text class="text-h5 font-weight-bold text-error pa-0 pt-1">
          ₹{{ totalExpenses.toFixed(2) }}
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="3">
      <v-card
        class="py-3 px-4 text-center rounded-lg hover-effect"
        elevation="3"
        color="blue-lighten-5"
      >
        <v-card-title
          class="text-subtitle-1 font-weight-regular text-primary pa-0"
        >
          Net Balance
        </v-card-title>
        <v-card-text class="text-h5 font-weight-bold text-primary pa-0 pt-1">
          ₹{{ netBalance.toFixed(2) }}
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="3">
      <v-card
        class="py-3 px-4 text-center rounded-lg hover-effect"
        elevation="3"
        color="purple-lighten-5"
      >
        <v-card-title
          class="text-subtitle-1 font-weight-regular text-purple pa-0"
        >
          Net Balance
        </v-card-title>
        <v-card-text class="text-h5 font-weight-bold text-purple pa-0 pt-1">
          {{ ratio.toFixed(1) }}%
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from "vue";
import { useTransactionStore } from "../../stores/index.js";

const store = useTransactionStore();

const totalIncome = computed(() => store.totalIncome);
const totalExpenses = computed(() => store.totalExpenses);
const netBalance = computed(() => store.netBalance);
const ratio = computed(() => store.expenseToIncomeRatio);
const userId = computed(() => store.userId);
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
