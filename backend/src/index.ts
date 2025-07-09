import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// Inicializa o Prisma Client
const prisma = new PrismaClient();
// Inicializa o Express
const app = express();
const PORT = 3000;

// Middlewares
app.use(cors()); // Habilita o CORS para todas as origens
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Rota de teste
app.get('/', (req: Request, res: Response) => {
  res.send('API de Publicidades está no ar!');
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});