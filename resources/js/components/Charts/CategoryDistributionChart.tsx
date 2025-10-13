import React from 'react';
import { BaseChart, chartColors, percentageFormatter } from './BaseChart';

interface CategoryDistributionChartProps {
    data: Array<{
        categoria: { nome: string };
        valor_total: number;
        quantidade_total: number;
    }>;
    className?: string;
    type?: 'pie' | 'doughnut';
}

export function CategoryDistributionChart({ data, className, type = 'doughnut' }: CategoryDistributionChartProps) {
    const colorPalette = [
        chartColors.primary,
        chartColors.secondary,
        chartColors.success,
        chartColors.warning,
        chartColors.danger,
        chartColors.info,
        chartColors.purple,
        chartColors.pink,
        chartColors.indigo,
        chartColors.teal,
    ];

    const totalValue = data.reduce((sum, item) => sum + item.valor_total, 0);

    const chartData = {
        labels: data.map((item) => item.categoria?.nome || 'Sem Categoria'),
        datasets: [
            {
                data: data.map((item) => item.valor_total),
                backgroundColor: colorPalette.slice(0, data.length),
                borderWidth: 2,
                borderColor: '#ffffff',
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    padding: 15,
                    usePointStyle: true,
                    generateLabels: (chart: any) => {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            return data.labels.map((label: string, i: number) => {
                                const value = data.datasets[0].data[i];
                                const percentage = (value / totalValue) * 100;

                                return {
                                    text: `${label} (${percentage.toFixed(1)}%)`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    index: i,
                                };
                            });
                        }
                        return [];
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const value = context.parsed;
                        const percentage = (value / totalValue) * 100;
                        return [`Valor: R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, `Percentual: ${percentage.toFixed(1)}%`];
                    },
                },
            },
        },
    };

    return <BaseChart type={type} data={chartData} options={options} className={className} height={300} />;
}
