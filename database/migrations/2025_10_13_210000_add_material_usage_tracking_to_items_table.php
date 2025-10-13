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
            // Add fields to track material usage
            $table->timestamp('first_used_at')->nullable()->after('updated_at');
            $table->timestamp('last_used_at')->nullable()->after('first_used_at');
            $table->boolean('is_frozen')->default(false)->after('last_used_at');
            $table->text('frozen_description')->nullable()->after('is_frozen');
            $table->unsignedBigInteger('frozen_by_user_id')->nullable()->after('frozen_description');
            $table->timestamp('frozen_at')->nullable()->after('frozen_by_user_id');

            // Add indexes for performance
            $table->index(['is_frozen']);
            $table->index(['first_used_at']);
            $table->index(['last_used_at']);

            // Add foreign key for frozen_by_user_id
            $table->foreign('frozen_by_user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropForeign(['frozen_by_user_id']);
            $table->dropIndex(['is_frozen']);
            $table->dropIndex(['first_used_at']);
            $table->dropIndex(['last_used_at']);
            $table->dropColumn([
                'first_used_at',
                'last_used_at',
                'is_frozen',
                'frozen_description',
                'frozen_by_user_id',
                'frozen_at'
            ]);
        });
    }
};
