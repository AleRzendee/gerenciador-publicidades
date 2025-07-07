Gerenciador de Publicidade

❯ Sobre o Projeto

Este projeto é um sistema full-stack para o gerenciamento de campanhas publicitárias, desenvolvido como um desafio técnico. A aplicação permite o cadastro, leitura, atualização e encerramento de publicidades, com funcionalidades que incluem upload de imagens, associação de campanhas a múltiplos estados e controle de vigência por datas.

A interface foi construída para ser limpa, reativa e intuitiva, seguindo um protótipo de design moderno.

❯ Funcionalidades Principais

    CRUD Completo:

        Criar: Adicionar novas publicidades através de um formulário em um dialog (modal).

        Ler: Listar todas as publicidades, separadas por status (Atuais e Outras).

        Atualizar: Editar informações de uma publicidade existente.

        Encerrar: Mudar o status de uma publicidade para "encerrada" (soft delete), mantendo o histórico.

    Filtros Dinâmicos: Filtragem da lista de publicidades em tempo real por Estado ou por termo de busca no título.

    Upload de Imagens: Funcionalidade de upload de imagem para cada campanha, com salvamento no servidor.

    Relacionamento N:M: Associação de uma única campanha a um ou mais estados brasileiros.

    Controle de Vigência: Classificação automática das campanhas baseada em suas datas de início e fim.

❯ Stack de Tecnologias

A aplicação foi construída com uma arquitetura moderna e desacoplada, utilizando as seguintes tecnologias:

Categoria
	

Tecnologia

Frontend
	

Componentes UI
	

Backend
	

Banco de Dados
	

Ambiente DB
	

❯ Como Executar o Projeto

Para executar este projeto, é necessário ter o Node.js (v22+) e o Docker Desktop instalados.

O ambiente é híbrido: o banco de dados roda em um contêiner Docker, enquanto o backend e o frontend rodam localmente.

1. Iniciar o Banco de Dados:

Na raiz do projeto, inicie o contêiner do PostgreSQL:
Bash

docker-compose up -d

2. Iniciar o Backend:

Abra um novo terminal, navegue até a pasta backend e inicie o servidor Node.js:
Bash

cd backend
npm install
npm run dev

O backend estará rodando em http://localhost:8000.

3. Iniciar o Frontend:

Abra um terceiro terminal, navegue até a pasta frontend e inicie o servidor do Angular:
Bash

cd frontend
npm install
ng serve

A aplicação estará acessível em http://localhost:4200.

❯ Desafios e Aprendizados

Um dos maiores desafios durante o desenvolvimento foi a configuração do ambiente. O plano inicial era utilizar uma stack PHP/Laravel totalmente conteinerizada com Docker. No entanto, foram encontrados problemas persistentes e raros de compatibilidade entre o Docker Desktop e o sistema de arquivos do Windows (WSL 2), que impediam a instalação correta das dependências e a criação dos arquivos do projeto.

Diante do cronograma apertado, a decisão técnica mais importante foi pivotar a arquitetura. Em vez de continuar em um ambiente instável, o backend foi migrado para Node.js com Express, rodando nativamente. Essa decisão estratégica permitiu contornar os problemas de ambiente, garantindo a estabilidade necessária para desenvolver e entregar todas as funcionalidades exigidas no prazo.

Essa jornada foi um aprendizado prático imenso sobre resiliência, depuração de ambientes complexos e tomada de decisão técnica para mitigar riscos em um projeto real.

Desenvolvido por Gustavo.