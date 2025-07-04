import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const PORT = 8000;

// Configuração da conexão com o banco de dados PostgreSQL no Docker
const pool = new Pool({
  user: 'admin',
  host: 'localhost', // ou 127.0.0.1
  database: 'publicidade_db',
  password: 'password',
  port: 5432,
});

app.use(cors());
app.use(express.json());

// Rota principal de teste
app.get('/', (req: Request, res: Response) => {
  res.send('Backend com Node.js/Express está no ar!');
});

// NOVA ROTA: Retorna todos os estados do banco
app.get('/api/estados', async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM cad_estado ORDER BY descricao');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar estados:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/publicidades', async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT p.*, string_agg(e.descricao, ', ') as estados
      FROM cad_publicidade p
      LEFT JOIN cad_publicidade_estado pe ON p.id = pe.id_publicidade
      LEFT JOIN cad_estado e ON pe.id_estado = e.id
      GROUP BY p.id
      ORDER BY p.dt_inicio DESC
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar publicidades:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando na porta http://localhost:${PORT}`);
});