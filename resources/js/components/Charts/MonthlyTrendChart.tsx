import React from 'react';
import { BaseChart, chartColors, currencyFormatter, dateFormatter } from './BaseChart';

interface MonthlyTrendChartProps {
    data: Array<{
        periodo: string;
        mes: string;
        valor_total: number;
        quantidade_total: number;
        itens_distintos: number;
    }>;
    className?: string;
}

export function MonthlyTrendChart({ data, className }: MonthlyTrendChartProps) {
    const chartData = {
        labels: data.map((item) => item.mes),
        datasets: [
            {
                label: 'Valor Total (R$)',
                data: data.map((item) => item.valor_total),
                borderColor: chartColors.primary,
                backgroundColor: `${chartColors.primary}20`,
                borderWidth: 2,
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Quantidade Total',
                data: data.map((item) => item.quantidade_total),
                borderColor: chartColors.success,
                backgroundColor: `${chartColors.success}20`,
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                yAxisID: 'y1',
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                callbacks: {
                    label: (context: any) => {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;

                        if (context.datasetIndex === 0) {
                            return `${label}: ${currencyFormatter.format(value)}`;
                        } else {
                            return `${label}: ${value.toLocaleString('pt-BR')} unidades`;
                        }
                    },
                },
            },
        },
        scales: {
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                ticks: {
                    callback: (value: any) => currencyFormatter.format(value),
                },
                title: {
                    display: true,
                    text: 'Valor (R$)',
                },
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                ticks: {
                    callback: (value: any) => value.toLocaleString('pt-BR'),
                },
                title: {
                    display: true,
                    text: 'Quantidade',
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    return <BaseChart type="line" data={chartData} options={options} className={className} height={350} />;
}
