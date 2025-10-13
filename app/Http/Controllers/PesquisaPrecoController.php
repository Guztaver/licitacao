<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class PesquisaPrecoController extends Controller
{
    /**
     * Search for price proposals in PNCP database.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function pesquisarPncp(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'term' => 'required|string|min:3|max:200',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Termo de busca inválido',
                'details' => $validator->errors()
            ], 400);
        }

        $searchTerm = $request->input('term');

        try {
            // Make request to PNCP API
            $response = $this->consultarPNCP($searchTerm);

            // Transform the data
            $proposals = $this->transformarDadosPNCP($response);

            return response()->json([
                'success' => true,
                'data' => $proposals,
                'total' => count($proposals),
                'search_term' => $searchTerm
            ]);

        } catch (\Exception $e) {
            Log::error('Erro ao consultar PNCP', [
                'error' => $e->getMessage(),
                'search_term' => $searchTerm,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Não foi possível conectar ao PNCP. Tente novamente.'
            ], 502);
        }
    }

    /**
     * Make HTTP request to PNCP API.
     *
     * @param string $searchTerm
     * @return array
     * @throws \Exception
     */
    private function consultarPNCP(string $searchTerm): array
    {
        $apiKey = env('PNCP_API_KEY');
        $baseUrl = env('PNCP_API_URL', 'https://pncp.gov.br/api/pesquisa/v1/propostas');

        // Simulate API call for demonstration
        // In production, this would be an actual HTTP request
        if (app()->environment('local') && !$apiKey) {
            return $this->simularRespostaPNCP($searchTerm);
        }

        // Actual API call
        $url = $baseUrl . '?' . http_build_query([
            'q' => $searchTerm,
            'chave' => $apiKey,
            'limite' => 50
        ]);

        $response = Http::timeout(30)->get($url);

        if (!$response->successful()) {
            throw new \Exception("PNCP API error: " . $response->status());
        }

        return $response->json();
    }

    /**
     * Transform PNCP response data to clean format.
     *
     * @param array $pncpData
     * @return array
     */
    private function transformarDadosPNCP(array $pncpData): array
    {
        $proposals = [];

        // Handle different possible response structures from PNCP
        $items = $pncpData['data'] ?? $pncpData['propostas'] ?? $pncpData['items'] ?? [];

        foreach ($items as $item) {
            $proposal = [
                'itemDescription' => $item['descricao'] ?? $item['item_descricao'] ?? $item['nome_item'] ?? 'Item não especificado',
                'supplierName' => $item['fornecedor_nome'] ?? $item['razao_social'] ?? $item['nome_fornecedor'] ?? 'Fornecedor não especificado',
                'unitPrice' => $this->formatarValor($item['valor_unitario'] ?? $item['preco_unitario'] ?? $item['valor'] ?? 0),
                'quantity' => $this->formatarQuantidade($item['quantidade'] ?? $item['qtd'] ?? 1),
                'uf' => $item['uf'] ?? $item['estado'] ?? $item['sigla_uf'] ?? 'N/A',
                'proposalDate' => $this->formatarData($item['data_proposta'] ?? $item['data'] ?? $item['criado_em'] ?? null),
                'municipio' => $item['municipio'] ?? $item['cidade'] ?? null,
                'numeroProcesso' => $item['numero_processo'] ?? $item['processo'] ?? null,
                'orgao' => $item['orgao'] ?? $item['nome_orgao'] ?? null,
                'modalidade' => $item['modalidade'] ?? $item['tipo_modalidade'] ?? null,
                'situacao' => $item['situacao'] ?? $item['status'] ?? 'N/A',
            ];

            $proposals[] = $proposal;
        }

        // Sort by unit price (lowest first)
        usort($proposals, function ($a, $b) {
            return $a['unitPrice'] <=> $b['unitPrice'];
        });

        return $proposals;
    }

    /**
     * Format monetary value.
     *
     * @param mixed $value
     * @return float
     */
    private function formatarValor($value): float
    {
        if (is_string($value)) {
            // Remove currency symbols and formatting
            $value = preg_replace('/[R$\s.,]/', '', $value);
        }

        // Convert to float and handle cents (assuming API returns in cents)
        $floatValue = (float) $value;
        return $floatValue > 1000 ? $floatValue / 100 : $floatValue;
    }

    /**
     * Format quantity.
     *
     * @param mixed $value
     * @return int
     */
    private function formatarQuantidade($value): int
    {
        return (int) $value;
    }

    /**
     * Format date.
     *
     * @param string|null $dateString
     * @return string
     */
    private function formatarData(?string $dateString): string
    {
        if (!$dateString) {
            return 'N/A';
        }

        try {
            $date = new \DateTime($dateString);
            return $date->format('d/m/Y');
        } catch (\Exception $e) {
            return 'N/A';
        }
    }

    /**
     * Simulate PNCP response for local development.
     *
     * @param string $searchTerm
     * @return array
     */
    private function simularRespostaPNCP(string $searchTerm): array
    {
        // Sample data for demonstration
        $sampleData = [
            [
                'descricao' => 'Computador Notebook Dell Inspiron 15',
                'fornecedor_nome' => 'Dell Computadores do Brasil S/A',
                'valor_unitario' => '3500.00',
                'quantidade' => '10',
                'uf' => 'SP',
                'data_proposta' => '2024-01-15',
                'municipio' => 'São Paulo',
                'numero_processo' => '2024/001',
                'orgao' => 'Ministério da Saúde',
                'modalidade' => 'Pregão Eletrônico',
                'situacao' => 'Ativa'
            ],
            [
                'descricao' => 'Computador Notebook HP ProBook 445',
                'fornecedor_nome' => 'HP Brasil Ltda.',
                'valor_unitario' => '3800.00',
                'quantidade' => '5',
                'uf' => 'RJ',
                'data_proposta' => '2024-01-20',
                'municipio' => 'Rio de Janeiro',
                'numero_processo' => '2024/002',
                'orgao' => 'Ministério da Educação',
                'modalidade' => 'Pregão Eletrônico',
                'situacao' => 'Ativa'
            ],
            [
                'descricao' => 'Monitor LED 24 polegadas LG',
                'fornecedor_nome' => 'LG Electronics do Brasil',
                'valor_unitario' => '850.00',
                'quantidade' => '20',
                'uf' => 'MG',
                'data_proposta' => '2024-01-10',
                'municipio' => 'Belo Horizonte',
                'numero_processo' => '2024/003',
                'orgao' => 'Secretaria de Administração',
                'modalidade' => 'Tomada de Preço',
                'situacao' => 'Ativa'
            ]
        ];

        // Filter sample data based on search term
        $filteredData = array_filter($sampleData, function ($item) use ($searchTerm) {
            $searchLower = strtolower($searchTerm);
            return stripos(strtolower($item['descricao']), $searchLower) !== false;
        });

        return [
            'success' => true,
            'total' => count($filteredData),
            'data' => $filteredData
        ];
    }
}