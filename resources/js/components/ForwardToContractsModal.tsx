import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, FileText } from 'lucide-react';

interface ForwardToContractsModalProps {
    isOpen: boolean;
    onClose: () => void;
    purchaseRequest: {
        id: number;
        title: string;
        description: string;
        estimated_total: number | null;
        items?: Array<{
            descricao_material: string;
            quantidade_solicitada: number;
            unidade_medida: string;
            valor_total_estimado: number;
        }>;
    } | null;
    onConfirm: () => void;
    isLoading: boolean;
}

export default function ForwardToContractsModal({ isOpen, onClose, purchaseRequest, onConfirm, isLoading }: ForwardToContractsModalProps) {
    const [confirmed, setConfirmed] = useState(false);

    if (!isOpen || !purchaseRequest) return null;

    const handleConfirm = () => {
        if (!confirmed) {
            setConfirmed(true);
            return;
        }
        onConfirm();
    };

    const totalItems = purchaseRequest.items?.length || 0;
    const totalQuantity = purchaseRequest.items?.reduce((sum, item) => sum + item.quantidade_solicitada, 0) || 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center space-x-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Encaminhar para Setor de Contratos</h3>
                </div>

                <div className="space-y-4">
                    {/* Confirmation Message */}
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            Tem certeza que deseja encaminhar o pedido <strong>#{purchaseRequest.id}</strong> para o setor de contratos? Uma minuta de
                            contrato será criada para análise.
                        </AlertDescription>
                    </Alert>

                    {/* Request Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Resumo do Pedido</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-500">Título:</span>
                                <span className="ml-2 font-medium">{purchaseRequest.title}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Valor Estimado:</span>
                                <span className="ml-2 font-medium">
                                    {purchaseRequest.estimated_total
                                        ? new Intl.NumberFormat('pt-BR', {
                                              style: 'currency',
                                              currency: 'BRL',
                                          }).format(purchaseRequest.estimated_total)
                                        : '-'}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">Itens:</span>
                                <span className="ml-2 font-medium">{totalItems} tipo(s)</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Quantidade Total:</span>
                                <span className="ml-2 font-medium">{totalQuantity.toLocaleString('pt-BR')} unidades</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">Descrição</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 rounded p-3">{purchaseRequest.description}</p>
                    </div>

                    {/* Items Preview */}
                    {purchaseRequest.items && purchaseRequest.items.length > 0 && (
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Itens a serem incluídos na minuta</h4>
                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-2 text-left">Descrição</th>
                                            <th className="px-3 py-2 text-center">Quantidade</th>
                                            <th className="px-3 py-2 text-left">Unidade</th>
                                            <th className="px-3 py-2 text-right">Valor Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {purchaseRequest.items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-3 py-2 font-medium">{item.descricao_material}</td>
                                                <td className="px-3 py-2 text-center">{item.quantidade_solicitada.toLocaleString('pt-BR')}</td>
                                                <td className="px-3 py-2">{item.unidade_medida}</td>
                                                <td className="px-3 py-2 text-right">
                                                    {new Intl.NumberFormat('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                    }).format(item.valor_total_estimado)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Process Information */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-blue-900">O que acontecerá após a confirmação:</h4>
                                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                                    <li>• Uma nova minuta de contrato será criada automaticamente</li>
                                    <li>• O status do pedido será alterado para "Aguardando Análise de Contrato"</li>
                                    <li>• Todos os itens do pedido serão copiados para a minuta</li>
                                    <li>• O setor de contratos receberá a minuta para análise e elaboração</li>
                                    <li>• Você poderá acompanhar o progresso na área de processos licitatórios</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Checkbox */}
                    {!confirmed && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <label className="flex items-start space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={confirmed}
                                    onChange={(e) => setConfirmed(e.target.checked)}
                                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-yellow-800">
                                    Eu confirmo que desejo encaminhar este pedido para o setor de contratos e estou ciente que uma minuta de contrato
                                    será criada para análise.
                                </span>
                            </label>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirm} disabled={!confirmed || isLoading} className="bg-blue-600 hover:bg-blue-700">
                        {isLoading ? 'Processando...' : confirmed ? 'Confirmar Encaminhamento' : 'Eu entendo, continuar'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
