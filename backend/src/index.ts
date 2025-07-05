import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import multer from 'multer';
import path from 'path';

const app = express();
const PORT = 8000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const pool = new Pool({ user: 'admin', host: 'localhost', database: 'publicidade_db', password: 'password', port: 5432 });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ROTA GET para buscar todas as publicidades
app.get('/api/publicidades', async (req, res) => {
    try {
        const hoje = new Date().toISOString().slice(0, 10);
        let queryText = `
          SELECT p.*, string_agg(e.sigla, ', ') as estados,
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
        const queryParams: any[] = [];
        const whereClauses: string[] = [];
        let paramIndex = 1;
        if (req.query.estado_id) {
          whereClauses.push(`p.id IN (SELECT id_publicidade FROM cad_publicidade_estado WHERE id_estado = $${paramIndex++})`);
          queryParams.push(req.query.estado_id);
        }
        if (req.query.q) {
          whereClauses.push(`p.titulo ILIKE $${paramIndex++}`);
          queryParams.push(`%${req.query.q}%`);
        }
        if (whereClauses.length > 0) { queryText += ' WHERE ' + whereClauses.join(' AND '); }
        queryText += ` GROUP BY p.id ORDER BY p.dt_inicio DESC`;
        const { rows } = await pool.query(queryText, queryParams);
        res.json(rows);
    } catch (err) {
        console.error('Erro ao buscar publicidades:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota GET para buscar todos os estados
app.get('/api/estados', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM cad_estado ORDER BY descricao');
        res.json(rows);
    } catch (err) {
        console.error('Erro ao buscar estados:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ROTA POST para criar uma nova publicidade
app.post('/api/publicidades', upload.single('imagem'), async (req, res) => {
  const { titulo, descricao, botao_link, titulo_botao_link, dt_inicio, dt_fim, estados } = req.body;
  const imagemPath = req.file ? req.file.path.replace(/\\/g, '/') : null;
  const estadosArray = estados ? estados.split(',') : [];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const q = `INSERT INTO cad_publicidade (titulo, descricao, imagem, botao_link, titulo_botao_link, dt_inicio, dt_fim) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;`;
    const result = await client.query(q, [titulo, descricao, imagemPath, botao_link, titulo_botao_link, dt_inicio, dt_fim]);
    const novaPublicidadeId = result.rows[0].id;
    if (estadosArray.length > 0) {
      for (const estadoId of estadosArray) {
        await client.query('INSERT INTO cad_publicidade_estado (id_publicidade, id_estado) VALUES ($1, $2);', [novaPublicidadeId, estadoId]);
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

// Rota GET para buscar UMA publicidade por ID
app.get('/api/publicidades/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const q = `SELECT p.*, (SELECT json_agg(e.*) FROM cad_publicidade_estado pe JOIN cad_estado e ON pe.id_estado = e.id WHERE pe.id_publicidade = p.id) as estados_obj FROM cad_publicidade p WHERE p.id = $1;`;
      const result = await pool.query(q, [id]);
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'Publicidade não encontrada.' });
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error('Erro ao buscar publicidade:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
  
// ROTA POST para ATUALIZAR uma publicidade
app.post('/api/publicidades/:id', upload.single('imagem'), async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, botao_link, titulo_botao_link, dt_inicio, dt_fim, estados } = req.body;
    const imagemPath = req.file ? req.file.path.replace(/\\/g, '/') : null;
    const estadosArray = estados ? estados.split(',') : [];
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      let updateQuery = `UPDATE cad_publicidade SET titulo = $1, descricao = $2, botao_link = $3, titulo_botao_link = $4, dt_inicio = $5, dt_fim = $6`;
      const params: any[] = [titulo, descricao, botao_link, titulo_botao_link, dt_inicio, dt_fim];
      if (imagemPath) {
        updateQuery += `, imagem = $${params.length + 1}`;
        params.push(imagemPath);
      }
      updateQuery += ` WHERE id = $${params.length + 1} RETURNING *;`;
      params.push(id);
      await client.query(updateQuery, params);
      await client.query('DELETE FROM cad_publicidade_estado WHERE id_publicidade = $1', [id]);
      if (estadosArray.length > 0) {
        for (const estadoId of estadosArray) {
          await client.query('INSERT INTO cad_publicidade_estado (id_publicidade, id_estado) VALUES ($1, $2);', [id, estadoId]);
        }
      }
      await client.query('COMMIT');
      res.status(200).json({ message: 'Publicidade atualizada com sucesso!' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao atualizar publicidade:', error);
      res.status(500).json({ error: 'Erro ao atualizar no banco de dados' });
    } finally {
      client.release();
    }
});

// ROTA PATCH PARA ENCERRAR UMA PUBLICIDADE
app.patch('/api/publicidades/:id/encerrar', async (req, res) => {
  const { id } = req.params;
  try {
    const q = `UPDATE cad_publicidade SET status = 'encerrada' WHERE id = $1 RETURNING *;`;
    const result = await pool.query(q, [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Publicidade não encontrada.' });
    } else {
      res.status(200).json({ message: 'Publicidade encerrada com sucesso!', data: result.rows[0] });
    }
  } catch (error) {
    console.error('Erro ao encerrar publicidade:', error);
    res.status(500).json({ error: 'Erro ao atualizar no banco de dados' });
  }
});

// --- INICIA O SERVIDOR ---
app.listen(PORT, () => {
  console.log(`Backend rodando na porta http://localhost:${PORT}`);
});