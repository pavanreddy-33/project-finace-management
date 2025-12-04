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
  const data = props.chartData.map((d) => d.balance);

  chartInstance = new Chart(chartRef.value, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Net Balance",
          data,
          borderColor: "#1E88E5",
          backgroundColor: "rgba(30,136,229,0.15)",
          tension: 0.3,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: "#1E88E5",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: "Date" } },
        y: {
          beginAtZero: false,
          title: { display: true, text: "Cumulative Balance (₹)" },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: { mode: "index", intersect: false },
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
