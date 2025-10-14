import { X, CheckSquare, FileText, DollarSign, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface ConsolidationSummary {
    totalRequests: number;
    totalUniqueItems: number;
    totalEstimatedValue: number;
}

interface ConsolidateConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (title: string, observations?: string) => void;
    summary: ConsolidationSummary;
}

export default function ConsolidateConfirmationModal({ isOpen, onClose, onConfirm, summary }: ConsolidateConfirmationModalProps) {
    const [title, setTitle] = useState('');
    const [observations, setObservations] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const handleConfirm = async () => {
        if (!title.trim()) {
            alert('Por favor, informe um título para o processo licitatório.');
            return;
        }

        setIsSubmitting(true);
        try {
            await onConfirm(title.trim(), observations.trim());
            setTitle('');
            setObservations('');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setTitle('');
            setObservations('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <CheckSquare className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Confirmar Consolidação</h2>
                            <p className="text-sm text-gray-600">Revise os detalhes antes de criar o processo licitatório</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleClose} disabled={isSubmitting}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">Pedidos</span>
                            </div>
                            <div className="text-2xl font-bold text-blue-900">{summary.totalRequests}</div>
                            <div className="text-xs text-blue-700">serão consolidados</div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <CheckSquare className="h-5 w-5 text-green-600" />
                                <span className="text-sm font-medium text-green-900">Itens Únicos</span>
                            </div>
                            <div className="text-2xl font-bold text-green-900">{summary.totalUniqueItems}</div>
                            <div className="text-xs text-green-700">após consolidação</div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <DollarSign className="h-5 w-5 text-amber-600" />
                                <span className="text-sm font-medium text-amber-900">Valor Total</span>
                            </div>
                            <div className="text-xl font-bold text-amber-900">{formatCurrency(summary.totalEstimatedValue)}</div>
                            <div className="text-xs text-amber-700">valor estimado</div>
                        </div>
                    </div>

                    {/* Important Note */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start space-x-2">
                            <ArrowRight className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="text-sm font-medium text-amber-900 mb-1">Importante</h3>
                                <p className="text-sm text-amber-800">
                                    Após a consolidação, os pedidos selecionados terão seu status alterado para
                                    <strong> "Em Processo Licitatório"</strong> e não poderão mais ser modificados individualmente.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Título do Processo Licitatório *</label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Licitação para Material de Escritório Q3 2025"
                                disabled={isSubmitting}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Observações (opcional)</label>
                            <Textarea
                                value={observations}
                                onChange={(e) => setObservations(e.target.value)}
                                placeholder="Adicione informações adicionais sobre este processo licitatório..."
                                disabled={isSubmitting}
                                rows={3}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t bg-gray-50">
                    <div className="text-sm text-gray-600">
                        <Badge variant="outline" className="text-xs">
                            Rascunho
                        </Badge>
                        <span className="ml-2">O processo será criado com status inicial "Rascunho"</span>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button onClick={handleConfirm} disabled={isSubmitting || !title.trim()} className="bg-blue-600 hover:bg-blue-700">
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Processando...
                                </>
                            ) : (
                                <>
                                    <CheckSquare className="mr-2 h-4 w-4" />
                                    Confirmar Consolidação
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
