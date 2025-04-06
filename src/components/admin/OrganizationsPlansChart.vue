<template>
  <div class="pie-chart bg-white dark:bg-gray-800 p-4 rounded-lg shadow mt-5">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, watch, onBeforeUnmount } from "vue";
import { Chart, ArcElement, Title, Tooltip, Legend, DoughnutController } from "chart.js";

// Register the necessary components for Chart.js
Chart.register(ArcElement, Title, Tooltip, Legend, DoughnutController);

export default {
  props: ["data"],
  setup(props) {
    const chartCanvas = ref(null);
    const chart = ref(null);
    const isDarkMode = ref(document.documentElement.classList.contains('dark'));

    // Function to generate unique colors for each data point
    const generateColors = (count) => {
      const colors = [];
      for (let i = 0; i < count; i++) {
        // Generate HSL colors with good spacing and saturation
        const hue = (i * 137.5) % 360; // Using golden ratio for better distribution
        colors.push(`hsl(${hue}, 75%, 60%)`);
      }
      return colors;
    };

    // Create or update chart
    const createChart = () => {
      if (chart.value) {
        chart.value.destroy();
        chart.value = null;
      }

      if (!chartCanvas.value || !props.data || props.data.length === 0) return;
      
      const ctx = chartCanvas.value.getContext("2d");
      
      // Make a copy of the data to avoid modifying props
      const filteredData = JSON.parse(JSON.stringify(props.data));
      
      // Process the data to adjust plan counts (skip the first plan)
      filteredData.forEach(item => {
        // If plansCount is greater than 0, subtract 1 to skip the init plan
        if (item.plansCount > 0) {
          item.plansCount -= 1;
        }
        
        // Organizations with only init plan or no plans will have 0 count
        // We'll handle them specially in the chart
      });
      
      // Separate organizations with actual plans from those with only init/no plans
      const orgsWithPlans = filteredData.filter(item => item.plansCount > 0);
      const orgsWithoutPlans = filteredData.filter(item => item.plansCount <= 0);
      
      const dataCount = filteredData.length;
      const colors = generateColors(dataCount);
    //   console.log("Chart data count:", filteredData.length);
    //   console.log("Orgs with plans:", orgsWithPlans.length);
    //   console.log("Orgs without plans:", orgsWithoutPlans.length);
      // Prepare data for the pie chart - only include orgs with actual plans in the chart
      // but keep all orgs in the labels
      const chartData = {
        labels: filteredData.map(item => item.name),
        datasets: [{
          data: filteredData.map(item => item.plansCount > 0 ? item.plansCount : 0),
          backgroundColor: colors,
          borderColor: isDarkMode.value ? '#1a202c' : '#ffffff',
          borderWidth: 1
        }]
      };

      // Text color based on dark mode
      const textColor = isDarkMode.value ? '#f3f4f6' : '#1f2937';

      // Create the pie chart
      chart.value = new Chart(ctx, {
        type: "doughnut",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '30%',
          radius: '90%',
          plugins: {
            legend: {
              position: "right",
              align: "start",
              labels: {
                color: textColor,
                font: {
                  size: window.innerWidth < 768 ? 10 : 12
                },
                padding: 15,
                boxWidth: 15,
                usePointStyle: true,
                pointStyle: 'circle',
                // Custom filter to show all organizations in legend
                filter: (legendItem) => true
              }
            },
            title: {
              display: true,
              text: 'Organizations by Plan Count',
              color: textColor,
              font: {
                size: window.innerWidth < 768 ? 14 : 16,
                weight: 'bold'
              },
              padding: {
                bottom: 15
              }
            },
            tooltip: {
              backgroundColor: isDarkMode.value ? '#374151' : '#ffffff',
              titleColor: textColor,
              bodyColor: textColor,
              borderColor: isDarkMode.value ? '#4b5563' : '#e5e7eb',
              borderWidth: 1,
              padding: 12,
              displayColors: true,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw;
                  if (value === 0) {
                    return `${label}: No purchased plans`;
                  }
                  return `${label}: ${value} plans`;
                }
              }
            }
          },
          layout: {
            padding: 10
          }
        },
      });
    };

    // Watch for dark mode changes
    const checkDarkMode = () => {
      isDarkMode.value = document.documentElement.classList.contains('dark');
      createChart();
    };

    onMounted(() => {
      // Add a small delay to ensure the canvas is ready
      setTimeout(() => {
        createChart();
      }, 200);
      
      // Watch for changes to the dark mode class on the html element
      const observer = new MutationObserver(checkDarkMode);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      
      // Watch for window resize
      window.addEventListener('resize', () => {
        setTimeout(createChart, 100);
      });
    });

    // Watch for data changes with immediate effect
    watch(() => props.data, (newData) => {
    //   console.log("Data changed, new length:", newData.length);
      setTimeout(createChart, 100);
    }, { deep: true, immediate: true });

    return {
      chartCanvas,
    };
  },
};
</script>

<style scoped>
.pie-chart {
  max-width: 600px;
  margin: 0 auto;
  transition: background-color 0.3s ease;
  height: 400px;
  position: relative;
}

@media (max-width: 640px) {
  .pie-chart {
    max-width: 100%;
    height: 350px;
  }
}
</style>
