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
        Schema::table('pedidos_manuais', function (Blueprint $table) {
            $table->foreignId('conferencia_id')->nullable()->constrained('conferencias')->onDelete('set null');
            $table->index(['conferencia_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pedidos_manuais', function (Blueprint $table) {
            $table->dropForeign(['conferencia_id']);
            $table->dropIndex(['conferencia_id']);
            $table->dropColumn('conferencia_id');
        });
    }
};
