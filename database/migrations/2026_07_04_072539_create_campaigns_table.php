<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('charity_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('tagline')->nullable();
            $table->longText('description_html')->nullable();
            $table->string('about_title')->default('About this Campaign');
            $table->bigInteger('goal_amount')->nullable(); // stored in cents
            $table->foreignId('currency_id')->constrained('currencies');
            $table->json('donation_presets')->nullable(); // [{amount: 25, label: 'Basic'}]
            $table->integer('preselected_index')->default(2);
            $table->boolean('allow_custom_amount')->default(true);
            $table->string('status')->default('active');
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
