<template>
  <v-sheet class="pa-4" elevation="0" rounded="lg">
    <div class="chart-wrapper">
      <canvas ref="chartRef"></canvas>
    </div>
  </v-sheet>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  chartData: { type: Array, required: true },
});

const chartRef = ref(null);
let chartInstance = null;

const palette = [
  "#2196F3",
  "#FF9800",
  "#4CAF50",
  "#9C27B0",
  "#FFC107",
  "#00BCD4",
  "#795548",
  "#E91E63",
];

const build = () => {
  if (!chartRef.value) return;
  if (chartInstance) chartInstance.destroy();

  const labels = props.chartData.map((d) => d.category);
  const data = props.chartData.map((d) => d.amount);

  chartInstance = new Chart(chartRef.value, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: palette.slice(0, labels.length),
          hoverOffset: 8,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              const val = context.parsed;
              const total = context.dataset.data.reduce((s, n) => s + n, 0);
              const pct = total ? ((val / total) * 100).toFixed(1) : 0;
              return `${context.label}: ₹${val.toFixed(2)} (${pct}%)`;
            },
          },
        },
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
  height: 380px;
}
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
