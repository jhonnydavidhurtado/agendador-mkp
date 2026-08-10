<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_settings', function (Blueprint $table) {

            $table->id();

            // Empresa
            $table->foreignId('company_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Configuración regional
            $table->string('timezone')->default('America/Bogota');
            $table->string('currency', 10)->default('COP');
            $table->string('language')->default('es');

            // Agenda
            $table->integer('appointment_interval')->default(30);

            // Inicio de semana
            $table->enum('start_week', [
                'monday',
                'sunday',
            ])->default('monday');

            // Imagen corporativa
            $table->string('logo')->nullable();
            $table->string('primary_color')->default('#0d6efd');
            $table->string('secondary_color')->default('#6c757d');

            // Notificaciones
            $table->boolean('notifications')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_settings');
    }
};