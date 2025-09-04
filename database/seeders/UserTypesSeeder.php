<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a Gestor (Manager) user
        User::firstOrCreate(
            ['email' => 'gestor@paubrasil.ba.gov.br'],
            [
                'name' => 'João Silva - Gestor',
                'password' => Hash::make('password'),
                'municipio' => 'Pau Brasil',
                'tipo_acesso' => 'gestor',
            ]
        );

        // Create an Operacional user
        User::firstOrCreate(
            ['email' => 'operacional@paubrasil.ba.gov.br'],
            [
                'name' => 'Maria Santos - Operacional',
                'password' => Hash::make('password'),
                'municipio' => 'Pau Brasil',
                'tipo_acesso' => 'operacional',
            ]
        );

        // Create a second Operacional user
        User::firstOrCreate(
            ['email' => 'operacional2@paubrasil.ba.gov.br'],
            [
                'name' => 'Carlos Oliveira - Operacional',
                'password' => Hash::make('password'),
                'municipio' => 'Pau Brasil',
                'tipo_acesso' => 'operacional',
            ]
        );

        $this->command->info('Created sample users:');
        $this->command->info('- Gestor: gestor@paubrasil.ba.gov.br / password');
        $this->command->info('- Operacional: operacional@paubrasil.ba.gov.br / password');
        $this->command->info('- Operacional 2: operacional2@paubrasil.ba.gov.br / password');
    }
}
