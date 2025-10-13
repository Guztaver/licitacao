import { useState } from 'react';
import { Search, X, ExternalLink, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

// Types
interface PNCPProposal {
    itemDescription: string;
    supplierName: string;
    unitPrice: number;
    quantity: number;
    uf: string;
    proposalDate: string;
    municipio?: string;
    numeroProcesso?: string;
    orgao?: string;
    modalidade?: string;
    situacao: string;
}

interface PriceResearchModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectProposal: (proposal: PNCPProposal) => void;
    trigger?: React.ReactNode;
}

// Constants
const MESSAGES = {
    title: 'Pesquisa de Preços - PNCP',
    description: 'Consulte preços de referência no Portal Nacional de Contratações Públicas',
    searchPlaceholder: 'Digite o termo para pesquisa (mínimo 3 caracteres)',
    searchButton: 'Pesquisar',
    clearButton: 'Limpar',
    noResults: 'Nenhum resultado encontrado',
    searchError: 'Ocorreu um erro ao consultar o PNCP. Tente novamente.',
    searching: 'Pesquisando...',
    selectProposal: 'Selecionar Proposta',
    showMoreResults: 'Mostrar mais resultados',
    loading: 'Carregando...',
    source: 'Fonte: PNCP',
    unitPrice: 'Valor Unitário',
    quantity: 'Quantidade',
    totalValue: 'Valor Total',
    supplier: 'Fornecedor',
    location: 'Localização',
    numeroProcesso: 'Processo',
    date: 'Data',
    status: 'Situação',
};

const MIN_SEARCH_LENGTH = 3;
const MAX_RESULTS = 50;

// Utility Functions
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

const getStatusBadge = (situacao: string) => {
    const variant = situacao === 'Ativa' ? 'default' : 'secondary';
    return <Badge variant={variant}>{situacao}</Badge>;
};

const getSearchAlert = (isLoading: boolean, searchError: string | null) => {
    if (isLoading) {
        return (
            <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>{MESSAGES.searching}</AlertDescription>
            </Alert>
        );
    }

    if (searchError) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{searchError}</AlertDescription>
            </Alert>
        );
    }

    return null;
};

// Main Component
export default function PriceResearchModal({
    open,
    onOpenChange,
    onSelectProposal,
    trigger
}: PriceResearchModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [proposals, setProposals] = useState<PNCPProposal[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState<PNCPProposal | null>(null);

    const handleSearch = async () => {
        if (searchTerm.trim().length < MIN_SEARCH_LENGTH) {
            setSearchError(`O termo de busca deve ter pelo menos ${MIN_SEARCH_LENGTH} caracteres.`);
            return;
        }

        setIsLoading(true);
        setSearchError(null);
        setHasSearched(true);

        try {
            const response = await fetch(`/api/price-research/pncp?term=${encodeURIComponent(searchTerm.trim())}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Erro desconhecido');
            }

            setProposals(data.data || []);
            if (data.data?.length === 0) {
                setSearchError(MESSAGES.noResults);
            }
        } catch (error) {
            console.error('Erro na pesquisa PNCP:', error);
            setSearchError(MESSAGES.searchError);
            setProposals([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        setProposals([]);
        setSearchError(null);
        setHasSearched(false);
        setSelectedProposal(null);
    };

    const handleSelectProposal = (proposal: PNCPProposal) => {
        setSelectedProposal(proposal);
        onSelectProposal(proposal);
        onOpenChange(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const searchAlert = getSearchAlert(isLoading, searchError);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        {MESSAGES.title}
                    </DialogTitle>
                    <DialogDescription>
                        {MESSAGES.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Search Section */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="search-term">Termo de Pesquisa</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="search-term"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={MESSAGES.searchPlaceholder}
                                    className="flex-1"
                                />
                                <Button
                                    onClick={handleSearch}
                                    disabled={isLoading || searchTerm.trim().length < MIN_SEARCH_LENGTH}
                                >
                                    {isLoading ? (
                                        <>
                                            <Clock className="mr-2 h-4 w-4 animate-spin" />
                                            {MESSAGES.searching}
                                        </>
                                    ) : (
                                        <>
                                            <Search className="mr-2 h-4 w-4" />
                                            {MESSAGES.searchButton}
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleClear}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            {searchTerm.trim().length > 0 && searchTerm.trim().length < MIN_SEARCH_LENGTH && (
                                <p className="text-sm text-muted-foreground">
                                    Mínimo de {MIN_SEARCH_LENGTH} caracteres para pesquisar
                                </p>
                            )}
                        </div>

                        {/* Source Attribution */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{MESSAGES.source}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="text-xs"
                            >
                                <a
                                    href="https://pncp.gov.br"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    Visitar PNCP
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Alerts */}
                    {searchAlert && (
                        <div className="space-y-2">
                            {searchAlert}
                        </div>
                    )}

                    {/* Results Section */}
                    {hasSearched && proposals.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">
                                    Resultados ({proposals.length})
                                </h3>
                                {selectedProposal && (
                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                        <CheckCircle className="h-4 w-4" />
                                        Proposta selecionada
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {proposals.map((proposal, index) => (
                                    <Card
                                        key={index}
                                        className={cn(
                                            "cursor-pointer transition-colors hover:bg-muted/50",
                                            selectedProposal === proposal && "ring-2 ring-primary"
                                        )}
                                        onClick={() => handleSelectProposal(proposal)}
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1 flex-1">
                                                    <CardTitle className="text-base line-clamp-2">
                                                        {proposal.itemDescription}
                                                    </CardTitle>
                                                    <CardDescription className="text-sm">
                                                        {proposal.supplierName}
                                                    </CardDescription>
                                                </div>
                                                <div className="flex flex-col items-end gap-2 ml-4">
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-primary">
                                                            {formatCurrency(proposal.unitPrice)}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {MESSAGES.unitPrice}
                                                        </div>
                                                    </div>
                                                    {getStatusBadge(proposal.situacao)}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">{MESSAGES.quantity}:</span>
                                                    <div className="font-medium">{proposal.quantity}</div>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">{MESSAGES.totalValue}:</span>
                                                    <div className="font-medium">
                                                        {formatCurrency(proposal.unitPrice * proposal.quantity)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">{MESSAGES.location}:</span>
                                                    <div className="font-medium">
                                                        {proposal.municipio ? `${proposal.municipio}/${proposal.uf}` : proposal.uf}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">{MESSAGES.date}:</span>
                                                    <div className="font-medium">{proposal.proposalDate}</div>
                                                </div>
                                            </div>

                                            {(proposal.numeroProcesso || proposal.orgao || proposal.modalidade) && (
                                                <div className="mt-3 pt-3 border-t space-y-1">
                                                    {proposal.numeroProcesso && (
                                                        <div className="text-sm">
                                                            <span className="text-muted-foreground">{MESSAGES.processo}:</span>{' '}
                                                            <span className="font-medium">{proposal.numeroProcesso}</span>
                                                        </div>
                                                    )}
                                                    {proposal.orgao && (
                                                        <div className="text-sm">
                                                            <span className="text-muted-foreground">Órgão:</span>{' '}
                                                            <span className="font-medium">{proposal.orgao}</span>
                                                        </div>
                                                    )}
                                                    {proposal.modalidade && (
                                                        <div className="text-sm">
                                                            <span className="text-muted-foreground">Modalidade:</span>{' '}
                                                            <span className="font-medium">{proposal.modalidade}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Results */}
                    {hasSearched && !isLoading && !searchError && proposals.length === 0 && (
                        <div className="text-center py-8">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Nenhum resultado encontrado</h3>
                            <p className="text-muted-foreground">
                                Tente usar termos mais genéricos ou verificar a ortografia.
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}