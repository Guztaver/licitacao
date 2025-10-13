import React from 'react';
import { BaseChart, chartColors, currencyFormatter } from './BaseChart';

interface MaterialValueChartProps {
    data: Array<{
        item: { descricao: string };
        valor_total: number;
    }>;
    className?: string;
}

export function MaterialValueChart({ data, className }: MaterialValueChartProps) {
    const chartData = {
        labels: data
            .slice(0, 10)
            .map((item) => (item.item.descricao.length > 30 ? item.item.descricao.substring(0, 30) + '...' : item.item.descricao)),
        datasets: [
            {
                label: 'Valor Total (R$)',
                data: data.slice(0, 10).map((item) => item.valor_total),
                backgroundColor: chartColors.primary,
                borderColor: chartColors.primary,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        return currencyFormatter.format(context.parsed.y);
                    },
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: (value: any) => currencyFormatter.format(value),
                },
            },
        },
    };

    return <BaseChart type="bar" data={chartData} options={options} className={className} height={300} />;
}
