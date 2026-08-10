
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {

            $table->id();

            // Empresa
            $table->foreignId('company_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Servicio
            $table->string('name');

            // Descripción
            $table->text('description')->nullable();

            // Duración en minutos
            $table->integer('duration')->default(30);

            // Precio
            $table->decimal('price', 10, 2)->default(0);

            // Color para el calendario
            $table->string('color')->default('#0d6efd');

            // Estado
            $table->boolean('status')->default(true);

            $table->timestamps();

            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};