
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('advisors', function (Blueprint $table) {

            $table->id();

            // Empresa propietaria
            $table->foreignId('company_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Usuario asociado al asesor
            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Foto
            $table->string('photo')->nullable();

            // Profesión
            $table->string('profession')->nullable();

            // Descripción
            $table->text('description')->nullable();

            // Estado
            $table->boolean('status')->default(true);

            $table->timestamps();

            $table->softDeletes();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('advisors');
    }
};