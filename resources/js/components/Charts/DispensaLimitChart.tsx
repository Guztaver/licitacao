import React from 'react';
import { BaseChart, chartColors, percentageFormatter } from './BaseChart';

interface DispensaLimitChartProps {
    data: Array<{
        categoria: string;
        valor_usado: number;
        limite_mensal: number;
        percentual_usado: number;
        status: 'normal' | 'alerta' | 'bloqueio';
    }>;
    className?: string;
}

export function DispensaLimitChart({ data, className }: DispensaLimitChartProps) {
    const chartData = {
        labels: data.map((item) => item.categoria),
        datasets: [
            {
                label: 'Valor Utilizado (R$)',
                data: data.map((item) => item.valor_usado),
                backgroundColor: data.map((item) => {
                    switch (item.status) {
                        case 'bloqueio':
                            return chartColors.danger;
                        case 'alerta':
                            return chartColors.warning;
                        default:
                            return chartColors.success;
                    }
                }),
                borderColor: data.map((item) => {
                    switch (item.status) {
                        case 'bloqueio':
                            return chartColors.danger;
                        case 'alerta':
                            return chartColors.warning;
                        default:
                            return chartColors.success;
                    }
                }),
                borderWidth: 1,
            },
            {
                label: 'Limite Mensal (R$)',
                data: data.map((item) => item.limite_mensal),
                backgroundColor: chartColors.secondary,
                borderColor: chartColors.secondary,
                borderWidth: 1,
                type: 'line' as const,
                fill: false,
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
                callbacks: {
                    afterLabel: (context: any) => {
                        if (context.datasetIndex === 0) {
                            const item = data[context.dataIndex];
                            return [
                                `Percentual utilizado: ${item.percentual_usado.toFixed(1)}%`,
                                `Status: ${item.status === 'bloqueio' ? 'Bloqueio' : item.status === 'alerta' ? 'Alerta' : 'Normal'}`,
                            ];
                        }
                        return '';
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value: any) => `R$ ${value.toLocaleString('pt-BR')}`,
                },
            },
        },
    };

    return <BaseChart type="bar" data={chartData} options={options} className={className} height={300} />;
}
