<?php

namespace Database\Seeders;

use App\Models\Item;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                "code" => "ITEM001",
                "name" => "Papel Sulfite A4 75g",
                "unit_of_measurement" => "RESMA",
                "medium_price" => 18.5,
            ],
            [
                "code" => "ITEM002",
                "name" => "Caneta Esferográfica Azul",
                "unit_of_measurement" => "UN",
                "medium_price" => 1.25,
            ],
            [
                "code" => "ITEM003",
                "name" => "Lápis Preto nº 2",
                "unit_of_measurement" => "UN",
                "medium_price" => 0.85,
            ],
            [
                "code" => "ITEM004",
                "name" => "Café em Pó 500g",
                "unit_of_measurement" => "PCT",
                "medium_price" => 12.5,
            ],
            [
                "code" => "ITEM005",
                "name" => "Água Mineral 500ml",
                "unit_of_measurement" => "UN",
                "medium_price" => 1.5,
            ],
            [
                "code" => "ITEM006",
                "name" => "Álcool em Gel 70%",
                "unit_of_measurement" => "L",
                "medium_price" => 15.0,
            ],
            [
                "code" => "ITEM007",
                "name" => "Detergente Líquido",
                "unit_of_measurement" => "L",
                "medium_price" => 2.8,
            ],
            [
                "code" => "ITEM008",
                "name" => "Sabonete Líquido",
                "unit_of_measurement" => "L",
                "medium_price" => 8.5,
            ],
            [
                "code" => "ITEM009",
                "name" => "Papel Higiênico Folha Dupla",
                "unit_of_measurement" => "PCT",
                "medium_price" => 22.0,
            ],
            [
                "code" => "ITEM010",
                "name" => "Copo Descartável 200ml",
                "unit_of_measurement" => "PCT",
                "medium_price" => 8.9,
            ],
            [
                "code" => "ITEM011",
                "name" => "Grampeador de Mesa",
                "unit_of_measurement" => "UN",
                "medium_price" => 25.0,
            ],
            [
                "code" => "ITEM012",
                "name" => "Tesoura 21cm",
                "unit_of_measurement" => "UN",
                "medium_price" => 12.0,
            ],
            [
                "code" => "ITEM013",
                "name" => "Cola Branca 90g",
                "unit_of_measurement" => "UN",
                "medium_price" => 3.5,
            ],
            [
                "code" => "ITEM014",
                "name" => "Fita Adesiva Transparente",
                "unit_of_measurement" => "UN",
                "medium_price" => 4.2,
            ],
            [
                "code" => "ITEM015",
                "name" => "Pasta Suspensa",
                "unit_of_measurement" => "UN",
                "medium_price" => 2.5,
            ],
            [
                "code" => "ITEM016",
                "name" => "Envelope Pardo A4",
                "unit_of_measurement" => "PCT",
                "medium_price" => 15.0,
            ],
            [
                "code" => "ITEM017",
                "name" => "Clipes nº 2/0",
                "unit_of_measurement" => "CX",
                "medium_price" => 6.5,
            ],
            [
                "code" => "ITEM018",
                "name" => "Borracha Branca",
                "unit_of_measurement" => "UN",
                "medium_price" => 1.0,
            ],
            [
                "code" => "ITEM019",
                "name" => "Apontador de Lápis",
                "unit_of_measurement" => "UN",
                "medium_price" => 1.8,
            ],
            [
                "code" => "ITEM020",
                "name" => "Marca Texto Amarelo",
                "unit_of_measurement" => "UN",
                "medium_price" => 3.2,
            ],
        ];

        foreach ($items as $item) {
            Item::create($item);
        }
    }
}
