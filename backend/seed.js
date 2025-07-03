const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'publicidade_db',
  password: 'password',
  port: 5432,
});

async function seed() {
  console.log('Iniciando o seeding...');
  try {
    // Inserir Publicidades
    await pool.query(`
      INSERT INTO cad_publicidade (titulo, descricao, imagem, botao_link, titulo_botao_link, dt_inicio, dt_fim, status) VALUES
      ('Convite Especial para Prefeitos(as) e Secretários(as)', 'Vagas limitadas e exclusivas para Prefeitos(as) e Secretários(as) — até 3 por município. Confirmação de presença até 05 de maio:', 'imagem1.png', 'https://example.com', 'Saiba Mais', '2025-07-01', '2025-07-30', 'ativa'),
      ('Festival de Inverno Rio 2025', 'De 10 a 20 de julho de 2025, o Festival de Inverno Rio retorna para transformar a cidade em um grande palco de cultura, música e arte. Serão dias repletos...', 'imagem2.png', 'https://example.com', 'Garanta seu Ingresso', '2025-07-10', '2025-07-20', 'ativa'),
      ('Bem-vindo ao GEOSIAP!', 'Um ambiente integrado e inteligente para transformar a gestão pública.', 'imagem3.png', 'https://example.com', 'Conheça', '2025-07-01', '2025-07-07', 'encerrada'),
      ('Gestores municipais têm acesso a novas funcionalidades do eSocial', 'Novas funcionalidades do módulo de relatórios do eSocial ajudam gestores a melhorar a transparência e eficiência na administração pública.', 'imagem4.png', 'https://example.com', 'Ver Novidades', '2025-09-01', '2025-09-30', 'ativa');
    `);

    // Associar Publicidades aos Estados
    await pool.query(`
      INSERT INTO cad_publicidade_estado (id_publicidade, id_estado) VALUES
      (1, 25), (1, 13), -- SP e MG para Publicidade 1
      (2, 19), -- RJ para Publicidade 2
      (3, 25), (3, 13), (3, 19), -- SP, MG, RJ para Publicidade 3
      (4, 25); -- SP para Publicidade 4
    `);

    console.log('Seeding concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o seeding:', error);
  } finally {
    await pool.end();
  }
}

seed();