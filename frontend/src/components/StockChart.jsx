import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const StockChart = () => {
  const [timeRange, setTimeRange] = useState('1m');
  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'Actual Price',
        data: [],
      },
      {
        name: 'Predicted Price',
        data: [],
      },
    ],
    options: {
      chart: {
        type: 'area',
        height: 350,
        stacked: false,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      colors: ['#2563eb', '#10b981'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            colors: '#6b7280',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#6b7280',
          },
          formatter: function (value) {
            return '$' + value.toFixed(2);
          },
        },
      },
      tooltip: {
        shared: true,
        y: {
          formatter: function (val) {
            return '$' + val.toFixed(2);
          },
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
      },
    },
  });

  // Simulate data fetching
  useEffect(() => {
    // This would be replaced with actual API calls
    const generateData = () => {
      const actual = [];
      const predicted = [];
      const now = new Date().getTime();
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(now - (29 - i) * 24 * 60 * 60 * 1000);
        const basePrice = 100 + Math.random() * 50;
        actual.push({
          x: date,
          y: basePrice,
        });
        predicted.push({
          x: date,
          y: basePrice + (Math.random() * 20 - 10),
        });
      }
      
      setChartData(prev => ({
        ...prev,
        series: [
          { ...prev.series[0], data: actual },
          { ...prev.series[1], data: predicted },
        ],
      }));
    };
    
    generateData();
  }, [timeRange]);

  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}> <br/><br/>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}> <br/><br/>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          AAPL - Apple Inc.
        </Typography> <br/><br/>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel> 
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          > 
            <MenuItem value="1w">1 Week</MenuItem>
            <MenuItem value="1m">1 Month</MenuItem>
            <MenuItem value="3m">3 Months</MenuItem>
            <MenuItem value="1y">1 Year</MenuItem>
          </Select>
        </FormControl>
      </Box> <br/><br/>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="area"
        height={350}
      /><br/><br/>
    </Box>
  );
};

export default StockChart;