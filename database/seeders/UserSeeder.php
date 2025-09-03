<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create specific admin and test users
        $users = [
            [
                'name' => 'Administrador do Sistema',
                'email' => 'admin@licitacao.gov.br',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'João Silva Santos',
                'email' => 'joao.silva@compras.gov.br',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Maria Oliveira Costa',
                'email' => 'maria.oliveira@compras.gov.br',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Pedro Almeida Ferreira',
                'email' => 'pedro.almeida@compras.gov.br',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Ana Paula Rodrigues',
                'email' => 'ana.rodrigues@compras.gov.br',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Carlos Eduardo Lima',
                'email' => 'carlos.lima@compras.gov.br',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Fernanda Souza Martins',
                'email' => 'fernanda.martins@compras.gov.br',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Roberto Carlos Pereira',
                'email' => 'roberto.pereira@compras.gov.br',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Juliana Mendes Barbosa',
                'email' => 'juliana.barbosa@compras.gov.br',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Antonio José Nascimento',
                'email' => 'antonio.nascimento@compras.gov.br',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Luciana Fernandes Gomes',
                'email' => 'luciana.gomes@compras.gov.br',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Ricardo Machado Oliveira',
                'email' => 'ricardo.oliveira@compras.gov.br',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Patrícia Alves Ribeiro',
                'email' => 'patricia.ribeiro@compras.gov.br',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Supervisor de Licitações',
                'email' => 'supervisor@licitacao.gov.br',
                'password' => Hash::make('supervisor123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Operador de Compras',
                'email' => 'operador@compras.gov.br',
                'password' => Hash::make('operador123'),
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }

        // Create additional random users using factory
        User::factory(15)->create();

        // Create some unverified users
        User::factory(5)->unverified()->create();

        $this->command->info('Usuários criados com sucesso!');
        $this->command->info('Total: ' . User::count() . ' usuários');
        $this->command->info('Verificados: ' . User::whereNotNull('email_verified_at')->count());
        $this->command->info('Não verificados: ' . User::whereNull('email_verified_at')->count());

        $this->command->info("\nUsuários principais criados:");
        $this->command->info("- admin@licitacao.gov.br (senha: admin123)");
        $this->command->info("- supervisor@licitacao.gov.br (senha: supervisor123)");
        $this->command->info("- operador@compras.gov.br (senha: operador123)");
        $this->command->info("- Demais usuários: password123");
    }
}
