<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Autorização de Compra - Requisição {{ $requisicao->numero_completo }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            margin: 0;
            padding: 20px;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
        }

        .title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            text-transform: uppercase;
        }

        .subtitle {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .via-info {
            text-align: right;
            font-size: 11px;
            color: #666;
            margin-top: 10px;
        }

        .content {
            margin-bottom: 30px;
        }

        .field-group {
            display: table;
            width: 100%;
            margin-bottom: 15px;
            border-collapse: collapse;
        }

        .field-row {
            display: table-row;
        }

        .field-label {
            display: table-cell;
            font-weight: bold;
            width: 25%;
            padding: 8px;
            border: 1px solid #000;
            background-color: #f5f5f5;
            vertical-align: top;
        }

        .field-value {
            display: table-cell;
            padding: 8px;
            border: 1px solid #000;
            vertical-align: top;
        }

        .field-full {
            width: 100%;
        }

        .description-field {
            min-height: 80px;
            vertical-align: top;
        }

        .signature-section {
            margin-top: 50px;
            page-break-inside: avoid;
        }

        .signature-box {
            border: 1px solid #000;
            height: 80px;
            margin-top: 20px;
            padding: 10px;
        }

        .signature-label {
            font-weight: bold;
            text-align: center;
            margin-bottom: 10px;
        }

        .signature-line {
            border-top: 1px solid #000;
            margin-top: 50px;
            padding-top: 5px;
            text-align: center;
            font-size: 10px;
        }

        .footer {
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 10px;
        }

        .status-badge {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 3px;
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
        }

        .status-autorizada { background-color: #e3f2fd; color: #1976d2; }
        .status-concretizada { background-color: #e8f5e8; color: #2e7d32; }
        .status-cancelada { background-color: #fff3e0; color: #f57c00; }
        .status-excluida { background-color: #ffebee; color: #d32f2f; }

        .print-info {
            font-size: 10px;
            color: #666;
            margin-bottom: 10px;
        }

        .two-column {
            display: table;
            width: 100%;
            table-layout: fixed;
        }

        .column {
            display: table-cell;
            width: 50%;
            padding: 0 10px;
            vertical-align: top;
        }

        .column:first-child {
            padding-left: 0;
        }

        .column:last-child {
            padding-right: 0;
        }

        @media print {
            body { margin: 0; padding: 15px; }
            .footer { position: fixed; bottom: 0; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">Autorização de Compra</div>
        <div class="subtitle">Prefeitura de Pau Brasil - Prestação de Contas</div>
        <div class="via-info">
            {{ $type === 'setor' ? 'VIA SETOR DE COMPRAS' : 'VIA FORNECEDOR' }}
        </div>
    </div>

    <div class="print-info">
        Impresso em: {{ $data_impressao }} | Usuário: {{ auth()->user()->name ?? 'Sistema' }}
    </div>

    <div class="content">
        <div class="field-group">
            <div class="field-row">
                <div class="field-label">Requisição Nº:</div>
                <div class="field-value">{{ $requisicao->numero_completo }}</div>
                <div class="field-label">Status:</div>
                <div class="field-value">
                    <span class="status-badge status-{{ $requisicao->status }}">
                        {{ $requisicao->status_display }}
                    </span>
                </div>
            </div>
        </div>

        <div class="field-group">
            <div class="field-row">
                <div class="field-label">Emitente:</div>
                <div class="field-value field-full">
                    {{ $emitente->nome }} ({{ $emitente->sigla }})
                </div>
            </div>
        </div>

        <div class="field-group">
            <div class="field-row">
                <div class="field-label">Destinatário:</div>
                <div class="field-value field-full">{{ $destinatario->nome }}</div>
            </div>
        </div>

        <div class="field-group">
            <div class="field-row">
                <div class="field-label">Solicitante:</div>
                <div class="field-value">{{ $requisicao->solicitante }}</div>
                <div class="field-label">Data Recebimento:</div>
                <div class="field-value">{{ $requisicao->data_recebimento->format('d/m/Y') }}</div>
            </div>
        </div>

        <div class="field-group">
            <div class="field-row">
                <div class="field-label">Nº do Ofício:</div>
                <div class="field-value">{{ $requisicao->numero_oficio ?? 'Não informado' }}</div>
                <div class="field-label">Nº Pedido Real:</div>
                <div class="field-value">{{ $requisicao->numero_pedido_real ?? 'Não informado' }}</div>
            </div>
        </div>

        <div class="field-group">
            <div class="field-row">
                <div class="field-label">Fornecedor:</div>
                <div class="field-value field-full">
                    @if($fornecedor)
                        {{ $fornecedor->razao_social }}
                        @if($fornecedor->cnpj)
                            - CNPJ: {{ $fornecedor->cnpj_formatado }}
                        @endif
                    @else
                        Não informado
                    @endif
                </div>
            </div>
        </div>

        @if($requisicao->valor_final)
        <div class="field-group">
            <div class="field-row">
                <div class="field-label">Valor Final:</div>
                <div class="field-value field-full">
                    R$ {{ number_format($requisicao->valor_final, 2, ',', '.') }}
                </div>
            </div>
        </div>
        @endif

        <div class="field-group">
            <div class="field-row">
                <div class="field-label">Descrição:</div>
                <div class="field-value field-full description-field">
                    {{ $requisicao->descricao }}
                </div>
            </div>
        </div>

        @if($requisicao->data_concretizacao)
        <div class="field-group">
            <div class="field-row">
                <div class="field-label">Data Concretização:</div>
                <div class="field-value">{{ $requisicao->data_concretizacao->format('d/m/Y H:i') }}</div>
                <div class="field-label">Usuário Concretização:</div>
                <div class="field-value">
                    {{ $requisicao->usuarioConcretizacao->name ?? 'Não informado' }}
                </div>
            </div>
        </div>
        @endif
    </div>

    @if($type === 'fornecedor')
    <div class="signature-section">
        <div class="signature-label">CONFIRMAÇÃO DO FORNECEDOR</div>

        <div class="two-column">
            <div class="column">
                <div class="signature-box">
                    <div style="text-align: center; margin-top: 20px; font-size: 10px;">
                        ASSINATURA
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="signature-box">
                    <div style="text-align: center; margin-top: 20px; font-size: 10px;">
                        CARIMBO DA EMPRESA
                    </div>
                </div>
            </div>
        </div>

        <div style="margin-top: 15px; font-size: 10px; text-align: center; color: #666;">
            Declaro que recebi e conferi os itens/serviços relacionados nesta autorização de compra.
        </div>

        <div class="signature-line">
            ________________________________<br>
            Nome: ____________________________<br>
            CPF: _____________________________<br>
            Data: ____________________________
        </div>
    </div>
    @endif

    <div class="footer">
        <div>
            <strong>Prefeitura Municipal de Pau Brasil</strong><br>
            Sistema de Gestão de Requisições e Conferência de Pedidos<br>
            Documento gerado automaticamente em {{ $data_impressao }}
        </div>
    </div>
</body>
</html>
