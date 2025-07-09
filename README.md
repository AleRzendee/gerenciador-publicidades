Dependências de Produção:

    express: O framework para construir nosso servidor web.

    @prisma/client: O cliente do Prisma que usaremos no código para fazer as queries ao banco.

    cors: Para permitir que nosso frontend (que rodará em localhost:4200) se comunique com nosso backend (em localhost:3000).

Dependências de Desenvolvimento:

    typescript, ts-node: Para podermos escrever e executar nosso código em TypeScript.

    nodemon: Para reiniciar o servidor automaticamente toda vez que salvarmos uma alteração no código.

    prisma: A ferramenta de linha de comando do Prisma (para migrations, etc.).

    @types/node, @types/express, @types/cors: Tipos do TypeScript para o Node.js, Express e Cors, nos dando o autocompletar e a segurança de tipos.