<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->boolean('is_permanente')->default(false)->after('descricao')->comment('Indicates if item is a permanent good for patrimonio integration');
            $table->decimal('valor_minimo_patrimonio', 15, 2)->default(1000)->after('is_permanente')->comment('Minimum value for patrimonio integration');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropColumn(['is_permanente', 'valor_minimo_patrimonio']);
        });
    }
};