import { Bar } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  BarElement, 
  CategoryScale, 
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import { Skeleton } from "@mui/material";

ChartJS.register(
  BarElement, 
  CategoryScale, 
  LinearScale,
  Tooltip,
  Legend,
  Title
);

export default function StatsChart({ data, loading }) {
  const chartData = {
    labels: ["Services", "Users", "Orders", "Providers"],
    datasets: [
      {
        label: "Total Count",
        backgroundColor: [
          'rgba(79, 70, 229, 0.7)',
          'rgba(22, 163, 74, 0.7)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(220, 38, 38, 0.7)'
        ],
        borderColor: [
          'rgba(79, 70, 229, 1)',
          'rgba(22, 163, 74, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(220, 38, 38, 1)'
        ],
        borderWidth: 1,
        borderRadius: 6,
        data: [data?.products || 0, data?.users || 0, data?.orders || 0, data?.partners || 0],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          },
          usePointStyle: true
        }
      },
      title: {
        display: true,
        text: 'Platform Statistics',
        font: {
          size: window.innerWidth < 768 ? 14 : 16
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: window.innerWidth < 768 ? 12 : 14
        },
        bodyFont: {
          size: window.innerWidth < 768 ? 10 : 12
        },
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          stepSize: calculateStepSize(data),
          padding: 10,
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          padding: 10,
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    layout: {
      padding: {
        left: window.innerWidth < 768 ? 5 : 10,
        right: window.innerWidth < 768 ? 5 : 10,
        top: window.innerWidth < 768 ? 5 : 10,
        bottom: window.innerWidth < 768 ? 5 : 10
      }
    }
  };

  function calculateStepSize(data) {
    if (!data) return 5;
    const maxValue = Math.max(data.products, data.users, data.orders, data.partners);
    if (maxValue <= 10) return 2;
    if (maxValue <= 50) return 5;
    if (maxValue <= 100) return 10;
    return Math.ceil(maxValue / 10);
  }

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={window.innerWidth < 768 ? 300 : 400}
          animation="wave"
          sx={{ 
            borderRadius: '12px',
            bgcolor: 'rgba(0, 0, 0, 0.05)'
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height: window.innerWidth < 768 ? '300px' : '400px' }}>
      <Bar 
        data={chartData} 
        options={options} 
        redraw={true}
      />
    </div>
  );
}