import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const PORT = 8000;

const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'publicidade_db',
  password: 'password',
  port: 5432,
});

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Backend com Node.js/Express está no ar!');
});

//* Rota para buscar todos os estados para o dropdown
app.get('/api/estados', async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM cad_estado ORDER BY descricao');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar estados:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

//* Rota para buscar todas as publicidades com seus estados (COM LÓGICA DE VIGÊNCIA)
app.get('/api/publicidades', async (req: Request, res: Response) => {
  try {
    const hoje = new Date().toISOString().slice(0, 10); // Data de hoje no formato YYYY-MM-DD

    let query = `
      SELECT 
        p.*, 
        string_agg(e.descricao, ', ') as estados,
        CASE
          WHEN p.status = 'encerrada' THEN 'encerrada'
          WHEN '${hoje}' BETWEEN p.dt_inicio AND p.dt_fim THEN 'atual'
          WHEN p.dt_inicio > '${hoje}' THEN 'futura'
          ELSE 'passada'
        END as categoria_vigencia
      FROM cad_publicidade p
      LEFT JOIN cad_publicidade_estado pe ON p.id = pe.id_publicidade
      LEFT JOIN cad_estado e ON pe.id_estado = e.id
    `;
    
    const params: any[] = [];
    const whereClauses: string[] = [];
    let paramIndex = 1;

    if (req.query.estado_id) {
      whereClauses.push(`p.id IN (SELECT id_publicidade FROM cad_publicidade_estado WHERE id_estado = $${paramIndex})`);
      params.push(req.query.estado_id);
      paramIndex++;
    }

    if (req.query.q) {
      whereClauses.push(`p.titulo ILIKE $${paramIndex}`);
      params.push(`%${req.query.q}%`);
      paramIndex++;
    }

    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses.join(' AND ');
    }

    query += `
      GROUP BY p.id
      ORDER BY p.dt_inicio DESC
    `;

    const { rows } = await pool.query(query, params);
    res.json(rows);

  } catch (err) {
    console.error('Erro ao buscar publicidades:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando na porta http://localhost:${PORT}`);
});