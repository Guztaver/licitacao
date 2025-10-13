import React, { useRef, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement);

interface BaseChartProps {
    type: 'line' | 'bar' | 'pie' | 'doughnut';
    data: any;
    options?: any;
    className?: string;
    height?: number;
}

export function BaseChart({ type, data, options = {}, className = '', height = 300 }: BaseChartProps) {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<ChartJS | null>(null);

    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#fff',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
            },
        },
        scales:
            type !== 'pie' && type !== 'doughnut'
                ? {
                      x: {
                          grid: {
                              display: false,
                          },
                      },
                      y: {
                          beginAtZero: true,
                          grid: {
                              borderDash: [2, 2],
                              color: 'rgba(0, 0, 0, 0.05)',
                          },
                      },
                  }
                : undefined,
        ...options,
    };

    useEffect(() => {
        if (!chartRef.current) return;

        // Destroy existing chart
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Create new chart
        const ctx = chartRef.current.getContext('2d');
        if (ctx) {
            chartInstance.current = new ChartJS(ctx, {
                type,
                data,
                options: defaultOptions,
            });
        }

        // Cleanup
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [type, data, defaultOptions]);

    return (
        <div className={`relative ${className}`} style={{ height: `${height}px` }}>
            <canvas ref={chartRef} />
        </div>
    );
}

// Chart configuration helpers
export const chartColors = {
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4',
    purple: '#8b5cf6',
    pink: '#ec4899',
    indigo: '#6366f1',
    teal: '#14b8a6',
};

export const defaultChartOptions = {
    line: {
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false,
    },
    bar: {
        borderWidth: 0,
        borderRadius: 4,
        borderSkipped: false,
    },
    pie: {
        borderWidth: 2,
        borderColor: '#fff',
    },
    doughnut: {
        borderWidth: 2,
        borderColor: '#fff',
        cutout: '60%',
    },
};

export const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

export const percentageFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

export const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    year: 'numeric',
});
