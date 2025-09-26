// client/src/components/ProgressChart.tsx

import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement,  
  Title, 
  Tooltip, 
  Legend, 
  type ChartData 
} from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement,  
  Title, 
  Tooltip, 
  Legend
);

// --- FIX 1: Explicitly define the interface before the component ---
interface ProgressChartProps {
  timeFrame: 'weekly' | 'monthly';
  data: {
    weeklyData: {
      labels: string[];
      // --- FIX 2: Use healthScore instead of compliance ---
      healthScore: number[]; 
      water: number[];
    };
    monthlyData: {
      labels: string[];
      weightLoss: number[];
    };
  } | null;
}
// -------------------------------------------------------------------


const ProgressChart: React.FC<ProgressChartProps> = ({ timeFrame, data }) => {
  if (!data) {
    return (
      <div className="chart-loading-placeholder">
        Fetching personalized progress data...
      </div>
    );
  }

  let chartData: ChartData<'line' | 'bar'>;
  let chartTitle: string;
  let chartType: 'line' | 'bar';

  // --- Logic to switch between Line (Weekly) and Bar (Monthly) ---
  if (timeFrame === 'weekly') {
    chartType = 'line';
    chartTitle = 'Weekly Health Balance Score';
    chartData = {
      labels: data.weeklyData.labels,
      datasets: [
        {
          type: 'line' as const,
          label: 'Balance Score (out of 100)',
          // --- FIX 3: Access the correct property ---
          data: data.weeklyData.healthScore, 
          backgroundColor: 'rgba(85, 107, 47, 0.4)', 
          borderColor: 'rgba(85, 107, 47, 1)',   
          borderWidth: 2,
          pointBackgroundColor: 'rgba(85, 107, 47, 1)', 
          tension: 0.4, 
          fill: true,   
        },
      ],
    } as ChartData<'line'>;
  } else { // 'monthly'
    chartType = 'bar';
    chartTitle = 'Monthly Weight Loss (Kg)';
    chartData = {
      labels: data.monthlyData.labels,
      datasets: [
        {
          type: 'bar' as const,
          label: 'Weight Loss (Kg)',
          data: data.monthlyData.weightLoss,
          backgroundColor: 'rgba(30, 144, 255, 0.8)',
          borderColor: 'rgba(30, 144, 255, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    } as ChartData<'bar'>;
  }
  
  // Options for the chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: chartTitle },
    },
    scales: {
        y: { 
            beginAtZero: true, 
            max: chartType === 'line' ? 100 : undefined, // Max 100 for score, auto for weight
            title: { display: true, text: chartType === 'line' ? 'Balance Score' : 'Weight (Kg)' } 
        }
    }
  };


  return (
    <div style={{ height: '100%', width: '100%' }}>
      {chartType === 'line' ? (
        <Line data={chartData as ChartData<'line'>} options={options} />
      ) : (
        <Bar data={chartData as ChartData<'bar'>} options={options} />
      )}
    </div>
  );
};

export default ProgressChart;