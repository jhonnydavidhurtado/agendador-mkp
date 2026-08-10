
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('calendar_hours', function (Blueprint $table) {

            $table->id();

            // Día del calendario
            $table->foreignId('calendar_day_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Hora inicial
            $table->time('start_time');

            // Hora final
            $table->time('end_time');

            // Disponible
            $table->boolean('status')->default(true);

            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('calendar_hours');
    }
};