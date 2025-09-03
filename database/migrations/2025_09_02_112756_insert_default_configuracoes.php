<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('configuracoes')->insert([
            [
                'chave' => 'sistema_nome',
                'valor' => 'Sistema de Licitações',
                'tipo' => 'string',
                'descricao' => 'Nome do sistema',
                'grupo' => 'sistema',
                'publico' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'chave' => 'sistema_versao',
                'valor' => '1.0.0',
                'tipo' => 'string',
                'descricao' => 'Versão do sistema',
                'grupo' => 'sistema',
                'publico' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'chave' => 'empresa_nome',
                'valor' => 'Prefeitura Municipal',
                'tipo' => 'string',
                'descricao' => 'Nome da empresa/instituição',
                'grupo' => 'empresa',
                'publico' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'chave' => 'empresa_cnpj',
                'valor' => '',
                'tipo' => 'string',
                'descricao' => 'CNPJ da empresa/instituição',
                'grupo' => 'empresa',
                'publico' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'chave' => 'empresa_endereco',
                'valor' => '',
                'tipo' => 'string',
                'descricao' => 'Endereço da empresa/instituição',
                'grupo' => 'empresa',
                'publico' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'chave' => 'empresa_telefone',
                'valor' => '',
                'tipo' => 'string',
                'descricao' => 'Telefone da empresa/instituição',
                'grupo' => 'empresa',
                'publico' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'chave' => 'empresa_email',
                'valor' => '',
                'tipo' => 'string',
                'descricao' => 'Email da empresa/instituição',
                'grupo' => 'empresa',
                'publico' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'chave' => 'smtp_host',
                'valor' => 'smtp.gmail.com',
                'tipo' => 'string',
                'descricao' => 'Servidor SMTP',
                'grupo' => 'email',
                'publico' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'chave' => 'smtp_port',
                'valor' => '587',
                'tipo' => 'string',
                'descricao' => 'Porta SMTP',
                'grupo' => 'email',
                'publico' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'chave' => 'smtp_username',
                'valor' => '',
                'tipo' => 'string',
                'descricao' => 'Usuário SMTP',
                'grupo' => 'email',
                'publico' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'chave' => 'smtp_password',
                'valor' => '',
                'tipo' => 'string',
                'descricao' => 'Senha SMTP',
                'grupo' => 'email',
                'publico' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'chave' => 'smtp_encryption',
                'valor' => 'tls',
                'tipo' => 'string',
                'descricao' => 'Criptografia SMTP',
                'grupo' => 'email',
                'publico' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'chave' => 'email_from_address',
                'valor' => '',
                'tipo' => 'string',
                'descricao' => 'Email remetente padrão',
                'grupo' => 'email',
                'publico' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'chave' => 'backup_automatico',
                'valor' => 'true',
                'tipo' => 'boolean',
                'descricao' => 'Realizar backup automático',
                'grupo' => 'backup',
                'publico' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'chave' => 'backup_frequencia',
                'valor' => 'diario',
                'tipo' => 'string',
                'descricao' => 'Frequência do backup (diario, semanal, mensal)',
                'grupo' => 'backup',
                'publico' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'chave' => 'manutencao_modo',
                'valor' => 'false',
                'tipo' => 'boolean',
                'descricao' => 'Modo de manutenção ativo',
                'grupo' => 'sistema',
                'publico' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'chave' => 'notificacoes_email',
                'valor' => 'true',
                'tipo' => 'boolean',
                'descricao' => 'Enviar notificações por email',
                'grupo' => 'notificacoes',
                'publico' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('configuracoes')->whereIn('chave', [
            'sistema_nome',
            'sistema_versao',
            'empresa_nome',
            'empresa_cnpj',
            'empresa_endereco',
            'empresa_telefone',
            'empresa_email',
            'smtp_host',
            'smtp_port',
            'smtp_username',
            'smtp_password',
            'smtp_encryption',
            'email_from_address',
            'backup_automatico',
            'backup_frequencia',
            'manutencao_modo',
            'notificacoes_email',
        ])->delete();
    }
};
