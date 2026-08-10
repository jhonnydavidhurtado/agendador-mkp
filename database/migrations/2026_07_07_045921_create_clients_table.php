<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {

            $table->id();

            // Empresa
            $table->foreignId('company_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Información del cliente
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->date('birthdate')->nullable();

            // Foto
            $table->string('photo')->nullable();

            // Observaciones
            $table->text('notes')->nullable();

            // Estado
            $table->boolean('status')->default(true);

            $table->timestamps();

            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
