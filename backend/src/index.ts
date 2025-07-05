import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import multer from 'multer';
import path from 'path';

const app = express();
const PORT = 8000;


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'publicidade_db',
  password: 'password',
  port: 5432,
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); 

//* --- Rotas da API ---

app.get('/api/publicidades', async (req: Request, res: Response) => {
    try {
        const hoje = new Date().toISOString().slice(0, 10);
        let query = `
          SELECT 
            p.*, 
            string_agg(e.sigla, ', ') as estados,
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
        query += ` GROUP BY p.id ORDER BY p.dt_inicio DESC`;
        const { rows } = await pool.query(query, params);
        res.json(rows);
      } catch (err) {
        console.error('Erro ao buscar publicidades:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
});

app.get('/api/estados', async (req: Request, res: Response) => {
    try {
        const { rows } = await pool.query('SELECT * FROM cad_estado ORDER BY descricao');
        res.json(rows);
      } catch (err) {
        console.error('Erro ao buscar estados:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
});

app.post('/api/publicidades', upload.single('imagem'), async (req: Request, res: Response) => {
  const { titulo, descricao, botao_link, titulo_botao_link, dt_inicio, dt_fim, estados } = req.body;
  const imagemPath = req.file ? req.file.path.replace(/\\/g, '/') : null;

  const estadosArray = estados ? estados.split(',') : [];

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const publicidadeQuery = `
      INSERT INTO cad_publicidade (titulo, descricao, imagem, botao_link, titulo_botao_link, dt_inicio, dt_fim)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id;
    `;
    const result = await client.query(publicidadeQuery, [titulo, descricao, imagemPath, botao_link, titulo_botao_link, dt_inicio, dt_fim]);
    const novaPublicidadeId = result.rows[0].id;

    if (estadosArray.length > 0) {
      for (const estadoId of estadosArray) {
        const assocQuery = `
          INSERT INTO cad_publicidade_estado (id_publicidade, id_estado) VALUES ($1, $2);
        `;
        await client.query(assocQuery, [novaPublicidadeId, estadoId]);
      }
    }
    
    await client.query('COMMIT');
    res.status(201).json({ message: 'Publicidade criada com sucesso!', id: novaPublicidadeId });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar publicidade:', error);
    res.status(500).json({ error: 'Erro ao salvar no banco de dados' });
  } finally {
    client.release();
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando na porta http://localhost:${PORT}`);
});