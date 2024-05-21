import {Bar} from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"  

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)


export const BarChart = ({data, title, xDesc, yDesc}) => {


  const options = {
    plugins: {
      title: {
        display: true,
        text: title,
        color:"#2B262D",
        font: {
          size: 24, 
        },
      },
      tooltip: {
        titleFont: {
          size: 16, 
        },
        bodyFont: {
          size: 18, 
        },
      },
      legend: {
        labels: {
          color:"#2B262D",
          font: {
            size: 16, 
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xDesc,
          font: {
            size: 18,
          },
          padding: {
            top: 10,
          },
          color: '#2B262D',
        },
        ticks: {
          color:"#2B262D",
          font: {
            size: 16, 
          },
        },
        grid: {
          color: "#6f6f73", 
        },
      },
      y: {
        title: {
          display: true,
          text: yDesc,
          font: {
            size: 18,
          },
          padding: {
            bottom: 10,
          },
          color: '#2B262D',
        },
        ticks: {
          color:"#2B262D",
          font: {
            size: 18, 
          },
        },
        grid: {
          color: "#6f6f73", 
        },
      },
    },
  };

  return <Bar options={options} data={data}/>
}