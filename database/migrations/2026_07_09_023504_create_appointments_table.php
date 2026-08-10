<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {

            $table->id();

            // Empresa
            $table->foreignId('company_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Asesor
            $table->foreignId('advisor_id')
                  ->constrained('advisors')
                  ->cascadeOnDelete();

            // Cliente
            $table->foreignId('client_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Servicio
            $table->foreignId('service_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Fecha y hora
            $table->date('date');

            $table->time('hour');

            // Estado
            $table->enum('status', [
                'pending',
                'confirmed',
                'completed',
                'cancelled',
            ])->default('pending');

            // Notas
            $table->text('notes')->nullable();

            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};