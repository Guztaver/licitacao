import React, { useState, useEffect, createContext, useContext } from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { BellIcon, ExclamationTriangleIcon, XMarkIcon, CheckCircleIcon, EyeIcon } from '@heroicons/react/24/outline';
import { alertaService, biddingUtils } from '@/services/bidding';
import type { LimiteDispensaAlerta } from '@/types/bidding';

interface NotificationContextType {
    alertasNaoLidos: number;
    atualizarAlertas: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
    alertasNaoLidos: 0,
    atualizarAlertas: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

interface NotificationBellProps {
    className?: string;
}

export function NotificationBell({ className }: NotificationBellProps) {
    const [alertasNaoLidos, setAlertasNaoLidos] = useState(0);
    const [alertasRecentes, setAlertasRecentes] = useState<LimiteDispensaAlerta[]>([]);
    const [loading, setLoading] = useState(false);

    const carregarAlertas = async () => {
        try {
            const [count, alertas] = await Promise.all([alertaService.contarNaoLidas(), alertaService.listar({ lida: false })]);
            setAlertasNaoLidos(count.count);
            setAlertasRecentes(alertas.slice(0, 5));
        } catch (error) {
            console.error('Erro ao carregar alertas:', error);
        }
    };

    useEffect(() => {
        carregarAlertas();

        // Atualizar alertas a cada 30 segundos
        const interval = setInterval(carregarAlertas, 30000);

        return () => clearInterval(interval);
    }, []);

    const marcarComoLido = async (id: number) => {
        try {
            await alertaService.marcarComoLida(id);
            setAlertasRecentes(alertasRecentes.filter((alerta) => alerta.id !== id));
            setAlertasNaoLidos((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Erro ao marcar alerta como lido:', error);
        }
    };

    const marcarTodosComoLidos = async () => {
        try {
            await alertaService.marcarTodasComoLidas();
            setAlertasRecentes([]);
            setAlertasNaoLidos(0);
        } catch (error) {
            console.error('Erro ao marcar todos os alertas como lidos:', error);
        }
    };

    const getAlertaIcon = (tipo: string) => {
        switch (tipo) {
            case 'critical':
                return <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />;
            case 'error':
                return <ExclamationTriangleIcon className="h-4 w-4 text-orange-600" />;
            case 'warning':
                return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />;
            default:
                return <BellIcon className="h-4 w-4 text-gray-600" />;
        }
    };

    const getAlertaColor = (tipo: string) => {
        switch (tipo) {
            case 'critical':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'error':
                return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'warning':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <NotificationContext.Provider value={{ alertasNaoLidos, atualizarAlertas: carregarAlertas }}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className={`relative ${className}`}>
                        <BellIcon className="h-5 w-5" />
                        {alertasNaoLidos > 0 && (
                            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                                {alertasNaoLidos > 99 ? '99+' : alertasNaoLidos}
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-96">
                    <DropdownMenuLabel className="flex items-center justify-between">
                        <span>Alertas de Limites</span>
                        {alertasNaoLidos > 0 && (
                            <Badge variant="destructive" className="text-xs">
                                {alertasNaoLidos} não lidos
                            </Badge>
                        )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {alertasRecentes.length === 0 ? (
                        <div className="p-4 text-center">
                            <CheckCircleIcon className="mx-auto h-8 w-8 text-green-500 mb-2" />
                            <p className="text-sm text-gray-600">Nenhum alerta novo</p>
                            <p className="text-xs text-gray-400">Todos os limites estão dentro do normal</p>
                        </div>
                    ) : (
                        <>
                            <div className="max-h-96 overflow-y-auto">
                                {alertasRecentes.map((alerta) => (
                                    <DropdownMenuItem key={alerta.id} className="p-3 cursor-pointer focus:bg-gray-50">
                                        <div className="flex items-start space-x-3 w-full">
                                            <div className={`p-1 rounded-full ${getAlertaColor(alerta.tipo_alerta)}`}>
                                                {getAlertaIcon(alerta.tipo_alerta)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-medium text-gray-900 truncate">
                                                        {alerta.categoria_material?.nome}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            marcarComoLido(alerta.id);
                                                        }}
                                                    >
                                                        <XMarkIcon className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-gray-600 mb-1 line-clamp-2">{alerta.mensagem}</p>
                                                <div className="flex items-center justify-between text-xs text-gray-400">
                                                    <span>{biddingUtils.formatarData(alerta.created_at)}</span>
                                                    <span>{alerta.percentual_usado.toFixed(1)}% utilizado</span>
                                                </div>
                                            </div>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </div>
                            <DropdownMenuSeparator />
                            <div className="p-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={marcarTodosComoLidos}
                                    disabled={alertasNaoLidos === 0}
                                >
                                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                                    Marcar todos como lidos
                                </Button>
                                <Button variant="ghost" size="sm" className="w-full mt-1" asChild>
                                    <Link href={route('dispensas.index', { tab: 'alertas' })}>
                                        <EyeIcon className="h-4 w-4 mr-2" />
                                        Ver todos os alertas
                                    </Link>
                                </Button>
                            </div>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </NotificationContext.Provider>
    );
}

interface AlertBannerProps {
    className?: string;
}

export function AlertBanner({ className }: AlertBannerProps) {
    const [alertasCriticos, setAlertasCriticos] = useState<LimiteDispensaAlerta[]>([]);
    const [loading, setLoading] = useState(false);
    const [dismissed, setDismissed] = useState<number[]>([]);

    useEffect(() => {
        const carregarAlertasCriticos = async () => {
            try {
                const alertas = await alertaService.listar({
                    tipo_alerta: 'critical',
                    lida: false,
                });
                setAlertasCriticos(alertas.filter((a) => !dismissed.includes(a.id)));
            } catch (error) {
                console.error('Erro ao carregar alertas críticos:', error);
            }
        };

        carregarAlertasCriticos();
        const interval = setInterval(carregarAlertasCriticos, 60000);
        return () => clearInterval(interval);
    }, [dismissed]);

    const dismissAlert = (id: number) => {
        setDismissed((prev) => [...prev, id]);
        setAlertasCriticos((prev) => prev.filter((a) => a.id !== id));
    };

    if (alertasCriticos.length === 0) {
        return null;
    }

    return (
        <div className={`space-y-2 ${className}`}>
            {alertasCriticos.map((alerta) => (
                <Alert key={alerta.id} className="border-red-200 bg-red-50">
                    <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">Alerta Crítico - Limite Excedido</AlertTitle>
                    <AlertDescription className="text-red-700">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <strong>{alerta.categoria_material?.nome}</strong>: {alerta.mensagem}
                                <div className="text-sm mt-1">
                                    Uso atual: {alerta.percentual_usado.toFixed(1)}% ({biddingUtils.formatarMoeda(alerta.valor_usado)})
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ml-4 text-red-600 hover:text-red-800"
                                onClick={() => dismissAlert(alerta.id)}
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            ))}
        </div>
    );
}

interface RealTimeMonitorProps {
    onNewAlert?: (alerta: LimiteDispensaAlerta) => void;
}

export function RealTimeMonitor({ onNewAlert }: RealTimeMonitorProps) {
    const { atualizarAlertas } = useNotifications();
    const [lastCheck, setLastCheck] = useState(Date.now());

    useEffect(() => {
        const checkForNewAlerts = async () => {
            try {
                const response = await fetch('/api/limite-alertas/check-new', {
                    headers: {
                        'X-Last-Check': lastCheck.toString(),
                    },
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.novos_alertas && data.novos_alertas.length > 0) {
                        // Mostrar notificação no navegador se permitido
                        if ('Notification' in window && Notification.permission === 'granted') {
                            data.novos_alertas.forEach((alerta: LimiteDispensaAlerta) => {
                                new Notification('Alerta de Limite de Dispensa', {
                                    body: `${alerta.categoria_material?.nome}: ${alerta.mensagem}`,
                                    icon: '/favicon.ico',
                                    tag: `alerta-${alerta.id}`,
                                });
                            });
                        }

                        // Atualizar contadores
                        atualizarAlertas();

                        // Chamar callback personalizado
                        data.novos_alertas.forEach((alerta: LimiteDispensaAlerta) => {
                            onNewAlert?.(alerta);
                        });
                    }

                    setLastCheck(Date.now());
                }
            } catch (error) {
                console.error('Erro ao verificar novos alertas:', error);
            }
        };

        // Verificar novos alertas a cada 30 segundos
        const interval = setInterval(checkForNewAlerts, 30000);

        // Solicitar permissão para notificações do navegador
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => clearInterval(interval);
    }, [lastCheck, atualizarAlertas, onNewAlert]);

    // Componente não renderiza nada visualmente
    return null;
}

// Hook para facilitar o uso do sistema de notificações
export function useNotificationSystem() {
    const { alertasNaoLidos, atualizarAlertas } = useNotifications();

    return {
        alertasNaoLidos,
        atualizarAlertas,
        temAlertasCriticos: alertasNaoLidos > 0,
    };
}

export default NotificationBell;
