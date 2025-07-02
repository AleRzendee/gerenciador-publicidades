<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::create('cad_estado', function (Blueprint $table) {
        $table->id();
        $table->string('descricao');
        $table->string('sigla', 2);
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('cad_estado');
}
};
