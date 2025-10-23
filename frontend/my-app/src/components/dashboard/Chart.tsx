'use client';

import { useState, useEffect } from 'react';

interface ChartData {
  labels: string[];
  data: number[];
}

interface ChartProps {
  data: ChartData;
  title: string;
  type: 'line' | 'bar' | 'doughnut';
  color?: string;
  height?: number;
}

export default function Chart({ data, title, type, color = '#8B5CF6', height = 200 }: ChartProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const renderLineChart = () => {
    const maxValue = Math.max(...data.data);
    const minValue = Math.min(...data.data);
    const range = maxValue - minValue;
    
    const points = data.data.map((value, index) => {
      const x = (index / (data.data.length - 1)) * 100;
      const y = 100 - ((value - minValue) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="relative" style={{ height: `${height}px` }}>
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            points={points}
            className="transition-all duration-1000 ease-out"
            style={{ strokeDasharray: isLoaded ? 'none' : '1000', strokeDashoffset: isLoaded ? '0' : '1000' }}
          />
          {data.data.map((value, index) => {
            const x = (index / (data.data.length - 1)) * 100;
            const y = 100 - ((value - minValue) / range) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1"
                fill={color}
                className="transition-all duration-1000 ease-out"
                style={{ opacity: isLoaded ? 1 : 0 }}
              />
            );
          })}
        </svg>
      </div>
    );
  };

  const renderBarChart = () => {
    const maxValue = Math.max(...data.data);
    
    return (
      <div className="flex items-end justify-between h-full px-2" style={{ height: `${height}px` }}>
        {data.data.map((value, index) => {
          const height = (value / maxValue) * 100;
          return (
            <div key={index} className="flex flex-col items-center flex-1 mx-1">
              <div
                className="w-full rounded-t transition-all duration-1000 ease-out"
                style={{
                  height: `${isLoaded ? height : 0}%`,
                  backgroundColor: color,
                  minHeight: '4px'
                }}
              />
              <div className="text-xs text-gray-500 mt-1">{data.labels[index]}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDoughnutChart = () => {
    const total = data.data.reduce((sum, value) => sum + value, 0);
    let cumulativePercentage = 0;
    
    return (
      <div className="relative" style={{ height: `${height}px`, width: `${height}px` }}>
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {data.data.map((value, index) => {
            const percentage = (value / total) * 100;
            const startAngle = (cumulativePercentage / 100) * 360;
            const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
            
            const startAngleRad = (startAngle - 90) * (Math.PI / 180);
            const endAngleRad = (endAngle - 90) * (Math.PI / 180);
            
            const largeArcFlag = percentage > 50 ? 1 : 0;
            
            const x1 = 50 + 35 * Math.cos(startAngleRad);
            const y1 = 50 + 35 * Math.sin(startAngleRad);
            const x2 = 50 + 35 * Math.cos(endAngleRad);
            const y2 = 50 + 35 * Math.sin(endAngleRad);
            
            const pathData = [
              `M 50 50 L ${x1} ${y1}`,
              `A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            cumulativePercentage += percentage;
            
            const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];
            
            return (
              <path
                key={index}
                d={pathData}
                fill={colors[index % colors.length]}
                className="transition-all duration-1000 ease-out"
                style={{ opacity: isLoaded ? 1 : 0 }}
              />
            );
          })}
          <circle cx="50" cy="50" r="15" fill="white" />
        </svg>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return renderLineChart();
      case 'bar':
        return renderBarChart();
      case 'doughnut':
        return renderDoughnutChart();
      default:
        return renderLineChart();
    }
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
      <div className="relative">
        {renderChart()}
      </div>
    </div>
  );
}
