<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    DB::table('cad_estado')->insert([
        ['descricao' => 'Acre', 'sigla' => 'AC'], ['descricao' => 'Alagoas', 'sigla' => 'AL'],
        ['descricao' => 'Amapá', 'sigla' => 'AP'], ['descricao' => 'Amazonas', 'sigla' => 'AM'],
        ['descricao' => 'Bahia', 'sigla' => 'BA'], ['descricao' => 'Ceará', 'sigla' => 'CE'],
        ['descricao' => 'Distrito Federal', 'sigla' => 'DF'], ['descricao' => 'Espírito Santo', 'sigla' => 'ES'],
        ['descricao' => 'Goiás', 'sigla' => 'GO'], ['descricao' => 'Maranhão', 'sigla' => 'MA'],
        ['descricao' => 'Mato Grosso', 'sigla' => 'MT'], ['descricao' => 'Mato Grosso do Sul', 'sigla' => 'MS'],
        ['descricao' => 'Minas Gerais', 'sigla' => 'MG'], ['descricao' => 'Pará', 'sigla' => 'PA'],
        ['descricao' => 'Paraíba', 'sigla' => 'PB'], ['descricao' => 'Paraná', 'sigla' => 'PR'],
        ['descricao' => 'Pernambuco', 'sigla' => 'PE'], ['descricao' => 'Piauí', 'sigla' => 'PI'],
        ['descricao' => 'Rio de Janeiro', 'sigla' => 'RJ'], ['descricao' => 'Rio Grande do Norte', 'sigla' => 'RN'],
        ['descricao' => 'Rio Grande do Sul', 'sigla' => 'RS'], ['descricao' => 'Rondônia', 'sigla' => 'RO'],
        ['descricao' => 'Roraima', 'sigla' => 'RR'], ['descricao' => 'Santa Catarina', 'sigla' => 'SC'],
        ['descricao' => 'São Paulo', 'sigla' => 'SP'], ['descricao' => 'Sergipe', 'sigla' => 'SE'],
        ['descricao' => 'Tocantins', 'sigla' => 'TO'],
    ]);
}
}
