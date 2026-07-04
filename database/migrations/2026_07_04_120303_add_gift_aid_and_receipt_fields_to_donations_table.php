<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->boolean('gift_aid_enabled')->default(false)->after('is_recurring');
            $table->string('gift_aid_name')->nullable()->after('gift_aid_enabled');
            $table->string('gift_aid_address')->nullable()->after('gift_aid_name');
            $table->bigInteger('gift_aid_amount')->nullable()->after('gift_aid_address');
            $table->bigInteger('total_benefit_amount')->nullable()->after('gift_aid_amount');
            $table->timestamp('receipt_sent_at')->nullable()->after('total_benefit_amount');
            $table->boolean('round_up')->default(false)->after('receipt_sent_at');
        });
    }

    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->dropColumn([
                'gift_aid_enabled',
                'gift_aid_name',
                'gift_aid_address',
                'gift_aid_amount',
                'total_benefit_amount',
                'receipt_sent_at',
                'round_up',
            ]);
        });
    }
};
