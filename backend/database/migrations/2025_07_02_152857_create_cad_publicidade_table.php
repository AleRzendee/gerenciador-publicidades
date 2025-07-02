<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::create('cad_publicidade', function (Blueprint $table) {
        $table->id();
        $table->string('titulo');
        $table->text('descricao');
        $table->string('imagem');
        $table->string('botao_link');
        $table->string('titulo_botao_link');
        $table->date('dt_inicio');
        $table->date('dt_fim');
        $table->enum('status', ['ativa', 'encerrada'])->default('ativa');
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('cad_publicidade');
}
};
