import CreateDestinatarioModal from '@/components/modals/CreateDestinatarioModal';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DESTINATARIOS_LABELS } from '@/hooks/use-destinatarios';
import { destinatarios } from '@/routes';
import type { Destinatario } from '@/types';
import { Link } from '@inertiajs/react';
import { MapPin, Plus } from 'lucide-react';

interface DestinatarisTableProps {
    destinatarios: Destinatario[];
    isFiltered: boolean;
    onReset: () => void;
    onReload: () => void;
}

export default function DestinatarisTable({ destinatarios: destinatariosList, isFiltered, onReset, onReload }: DestinatarisTableProps) {
    const hasResults = destinatariosList.length > 0;

    if (!hasResults) {
        return (
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{DESTINATARIOS_LABELS.nomeESigla}</TableHead>
                            <TableHead>{DESTINATARIOS_LABELS.contato}</TableHead>
                            <TableHead>{DESTINATARIOS_LABELS.requisicoes}</TableHead>
                            <TableHead>{DESTINATARIOS_LABELS.acoes}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={4} className="py-8 text-center">
                                <div className="flex flex-col items-center space-y-2">
                                    <MapPin className="h-8 w-8 text-gray-400" />
                                    {isFiltered ? (
                                        <>
                                            <p className="text-gray-500">{DESTINATARIOS_LABELS.nenhumResultado}</p>
                                            <Button variant="outline" size="sm" onClick={onReset}>
                                                {DESTINATARIOS_LABELS.limparFiltros}
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-gray-500">{DESTINATARIOS_LABELS.nenhumDestinatario}</p>
                                            <CreateDestinatarioModal
                                                trigger={
                                                    <Button size="sm">
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        {DESTINATARIOS_LABELS.adicionarPrimeiro}
                                                    </Button>
                                                }
                                                onSuccess={onReload}
                                            />
                                        </>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{DESTINATARIOS_LABELS.nomeESigla}</TableHead>
                        <TableHead>{DESTINATARIOS_LABELS.contato}</TableHead>
                        <TableHead>{DESTINATARIOS_LABELS.requisicoes}</TableHead>
                        <TableHead>{DESTINATARIOS_LABELS.acoes}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {destinatariosList.map((destinatario) => (
                        <TableRow key={destinatario.id}>
                            <TableCell>
                                <div>
                                    <Link href={destinatarios.show(destinatario.id)} className="font-medium text-blue-800 hover:text-blue-800">
                                        {destinatario.nome}
                                    </Link>
                                    <p className="text-sm text-gray-500">
                                        Sigla: <span className="font-mono">{destinatario.sigla}</span>
                                    </p>
                                    {destinatario.endereco && <p className="text-sm text-gray-500">{destinatario.endereco}</p>}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="text-sm">
                                    {destinatario.telefone && <p>{destinatario.telefone}</p>}
                                    {destinatario.email && <p className="text-gray-500">{destinatario.email}</p>}
                                    {!destinatario.telefone && !destinatario.email && <span className="text-gray-400">-</span>}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="text-sm">
                                    <span className="font-medium">{destinatario.requisicoes_count || 0}</span>
                                    <span className="text-gray-500"> requisições</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center space-x-2">
                                    <Link href={destinatarios.show(destinatario.id)}>
                                        <Button variant="outline" size="sm">
                                            {DESTINATARIOS_LABELS.ver}
                                        </Button>
                                    </Link>
                                    <Link href={destinatarios.edit(destinatario.id)}>
                                        <Button variant="outline" size="sm">
                                            {DESTINATARIOS_LABELS.editar}
                                        </Button>
                                    </Link>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
