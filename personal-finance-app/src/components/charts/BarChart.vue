<template>
  <v-sheet class="pa-4" elevation="0" rounded="lg">
    <div class="chart-wrapper">
      <canvas ref="chartRef"></canvas>
    </div>
  </v-sheet>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const props = defineProps({
  chartData: { type: Array, required: true },
});

const chartRef = ref(null);
let chartInstance = null;

const build = () => {
  if (!chartRef.value) return;
  if (chartInstance) chartInstance.destroy();

  const labels = props.chartData.map((d) => d.month);
  const incomes = props.chartData.map((d) => d.income);
  const expenses = props.chartData.map((d) => d.expense);

  chartInstance = new Chart(chartRef.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Income", data: incomes, backgroundColor: "#4CAF50" },
        { label: "Expense", data: expenses, backgroundColor: "#F44336" },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: "Month" } },
        y: { beginAtZero: true, title: { display: true, text: "Amount (₹)" } },
      },
      plugins: {
        tooltip: { mode: "index", intersect: false },
        legend: { position: "top" },
        title: { display: false },
      },
    },
  });
};

onMounted(build);
watch(() => props.chartData, build, { deep: true });
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 400px;
}
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
