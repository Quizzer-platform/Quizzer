<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow w-full mt-4 mb-6">
    <h3 class="text-xl font-semibold text-teal-800 dark:text-teal-500 mb-4">
      Users Performance
    </h3>
    <div v-if="hasData" class="chart-container">
      <BarChart :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="flex flex-col items-center justify-center h-60">
      <p class="text-gray-500 dark:text-gray-400 text-center">
        No quiz data available. Users haven't taken any quizzes yet.
      </p>
    </div>
  </div>
</template>

<script>
import { Bar as BarChart } from "vue-chartjs";
import { defineComponent, computed, ref, onMounted } from "vue";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default defineComponent({
  name: "UsersChart",
  components: {
    BarChart,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    // Track dark mode state
    const isDarkMode = ref(false);

    // Check for dark mode on component mount and watch for changes
    onMounted(() => {
      checkDarkMode();
      // Watch for changes to the dark mode class on the html element
      const observer = new MutationObserver(checkDarkMode);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    });

    // Function to check if dark mode is active
    function checkDarkMode() {
      isDarkMode.value = document.documentElement.classList.contains('dark');
    }

    // Check if we have data to display
    const hasData = computed(() => {
      return props.data && props.data.length > 0;
    });

    // Prepare data for Chart.js
    const chartData = computed(() => {
      if (!hasData.value) {
        return {
          labels: [],
          datasets: []
        };
      }
      // Get unique quiz titles and user names
      const quizTitles = [...new Set(props.data.map(d => d.quizTitle || d.name))];
      const userNames = [...new Set(props.data.map(d => d.userName || d.email))];
    //   console.log("Quiz titles:", quizTitles);
    //   console.log("User names:", userNames);
      return {
        labels: quizTitles,
        datasets: userNames.map((name, index) => ({
          label: name,
          data: quizTitles.map(title => {
            const found = props.data.find(item => 
              (item.quizTitle === title || item.name === title) && 
              (item.userName === name || item.email === name)
            );
            return found ? (found.score || found.quizScore || 0) : 0;
          }),
          backgroundColor: `hsl(${index * 50}, 70%, 60%)`
        }))
      };
    });

    // Chart options with dark mode support
    const chartOptions = computed(() => {
      const textColor = isDarkMode.value ? '#f3f4f6' : '#1f2937';
      const gridColor = isDarkMode.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: textColor,
              boxWidth: window.innerWidth < 768 ? 10 : 40,
              font: {
                size: window.innerWidth < 768 ? 10 : 12
              }
            }
          },
          title: {
            display: true,
            text: 'Users Scores per Quiz',
            color: textColor,
            font: {
              size: window.innerWidth < 768 ? 14 : 16
            }
          },
          tooltip: {
            backgroundColor: isDarkMode.value ? '#374151' : '#ffffff',
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: isDarkMode.value ? '#4b5563' : '#e5e7eb', 
            borderWidth: 1,
            bodyFont: {
              size: window.innerWidth < 768 ? 10 : 12
            },
            titleFont: {
              size: window.innerWidth < 768 ? 12 : 14
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
            grid: {
              color: gridColor
            },
            ticks: {
              color: textColor,
              font: {
                size: window.innerWidth < 768 ? 10 : 12
              }
            }
          },
          x: {
            grid: {
              color: gridColor
            },
            ticks: {
              color: textColor,
              maxRotation: 45,
              minRotation: 45,
              font: {
                size: window.innerWidth < 768 ? 10 : 12
              }
            }
          }
        }
      };
    });

    return {
      hasData,
      chartData,
      chartOptions
    };
  }
});
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 60vh;
  min-height: 300px;
  width: 100%;
}

@media (max-width: 640px) {
  .chart-container {
    height: 50vh;
    min-height: 250px;
  }
}
</style>
