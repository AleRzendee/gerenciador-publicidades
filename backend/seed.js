const { Pool } = require('pg');

// CONEXÃO CORRIGIDA PARA APONTAR PARA LOCALHOST
const pool = new Pool({
  user: 'admin',
  host: 'localhost', // <-- Conectando do seu PC para a porta exposta do Docker
  database: 'publicidade_db',
  password: 'password',
  port: 5432,
});

const criarTabelasQuery = `
  CREATE TABLE IF NOT EXISTS cad_estado (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    sigla VARCHAR(2) NOT NULL
  );
  CREATE TABLE IF NOT EXISTS cad_publicidade (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    imagem VARCHAR(255) NOT NULL,
    botao_link VARCHAR(255) NOT NULL,
    titulo_botao_link VARCHAR(255) NOT NULL,
    dt_inicio DATE NOT NULL,
    dt_fim DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ativa' NOT NULL
  );
  CREATE TABLE IF NOT EXISTS cad_publicidade_estado (
    id SERIAL PRIMARY KEY,
    id_publicidade INTEGER NOT NULL REFERENCES cad_publicidade(id) ON DELETE CASCADE,
    id_estado INTEGER NOT NULL REFERENCES cad_estado(id) ON DELETE CASCADE,
    UNIQUE(id_publicidade, id_estado)
  );
`;

const inserirDadosQuery = `
  INSERT INTO cad_estado (descricao, sigla) VALUES
  ('Acre', 'AC'), ('Alagoas', 'AL'), ('Amapá', 'AP'), ('Amazonas', 'AM'), ('Bahia', 'BA'), ('Ceará', 'CE'), ('Distrito Federal', 'DF'), ('Espírito Santo', 'ES'), ('Goiás', 'GO'), ('Maranhão', 'MA'), ('Mato Grosso', 'MT'), ('Mato Grosso do Sul', 'MS'), ('Minas Gerais', 'MG'), ('Pará', 'PA'), ('Paraíba', 'PB'), ('Paraná', 'PR'), ('Pernambuco', 'PE'), ('Piauí', 'PI'), ('Rio de Janeiro', 'RJ'), ('Rio Grande do Norte', 'RN'), ('Rio Grande do Sul', 'RS'), ('Rondônia', 'RO'), ('Roraima', 'RR'), ('Santa Catarina', 'SC'), ('São Paulo', 'SP'), ('Sergipe', 'SE'), ('Tocantins', 'TO')
  ON CONFLICT DO NOTHING;

  INSERT INTO cad_publicidade (id, titulo, descricao, imagem, botao_link, titulo_botao_link, dt_inicio, dt_fim, status) VALUES
  (1, 'Convite Especial para Prefeitos(as) e Secretários(as)', 'Vagas limitadas...', 'uploads/placeholder.png', 'Saiba Mais', '2025-07-01', '2025-07-30', 'ativa'),
  (2, 'Festival de Inverno Rio 2025', 'De 10 a 20 de julho...', 'uploads/placeholder.png', 'Garanta seu Ingresso', '2025-07-10', '2025-07-20', 'ativa'),
  (3, 'Bem-vindo ao GEOSIAP!', 'Um ambiente integrado...', 'uploads/placeholder.png', 'Conheça', '2025-07-01', '2025-07-07', 'encerrada'),
  (4, 'Gestores municipais têm acesso a novas funcionalidades do eSocial', 'Novas funcionalidades...', 'uploads/placeholder.png', 'Ver Novidades', '2025-09-01', '2025-09-30', 'ativa')
  ON CONFLICT DO NOTHING;

  INSERT INTO cad_publicidade_estado (id_publicidade, id_estado) VALUES
  (1, 25), (1, 13), (2, 19), (3, 25), (3, 13), (3, 19), (4, 25)
  ON CONFLICT DO NOTHING;
`;

async function seed() {
  console.log('Iniciando o seeding...');
  const client = await pool.connect();
  try {
    console.log('1. Criando tabelas (se não existirem)...');
    await client.query(criarTabelasQuery);
    console.log('2. Inserindo dados...');
    await client.query(inserirDadosQuery);
    console.log('Seeding concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o seeding:', error);
  } finally {
    await client.end();
  }
}

seed();