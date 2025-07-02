<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Publicidade extends Model
{
    use HasFactory;

    protected $table = 'cad_publicidade';

    protected $fillable = [
        'titulo',
        'descricao',
        'imagem',
        'botao_link',
        'titulo_botao_link',
        'dt_inicio',
        'dt_fim',
        'status',
    ];

    protected $casts = [
        'dt_inicio' => 'date:Y-m-d',
        'dt_fim' => 'date:Y-m-d',
    ];

    public function estados(): BelongsToMany
    {
        return $this->belongsToMany(Estado::class, 'cad_publicidade_estado', 'id_publicidade', 'id_estado');
    }
}