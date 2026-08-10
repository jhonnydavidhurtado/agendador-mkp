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
        Schema::table('users', function (Blueprint $table) {

            $table->foreignId('company_id')
                ->nullable()
                ->constrained('companies')
                ->nullOnDelete()
                ->after('id');

            $table->string('nit')->nullable()->after('name');
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();

            $table->string('logo')->nullable();
            $table->string('cover')->nullable();

            $table->boolean('status')->default(true);

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->dropForeign(['company_id']);
            $table->dropForeign(['created_by']);

            $table->dropColumn([
                'company_id',
                'nit',
                'phone',
                'address',
                'city',
                'country',
                'logo',
                'cover',
                'status',
                'created_by',
                'deleted_at'
            ]);
        });
    }
};
