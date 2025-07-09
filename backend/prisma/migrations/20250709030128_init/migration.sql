-- CreateTable
CREATE TABLE "cad_estado" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,

    CONSTRAINT "cad_estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cad_publicidade" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,
    "botao_link" TEXT NOT NULL,
    "titulo_botao_link" TEXT NOT NULL,
    "dt_inicio" TIMESTAMP(3) NOT NULL,
    "dt_fim" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cad_publicidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cad_publicidade_estado" (
    "id" SERIAL NOT NULL,
    "id_publicidade" INTEGER NOT NULL,
    "id_estado" INTEGER NOT NULL,

    CONSTRAINT "cad_publicidade_estado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cad_estado_sigla_key" ON "cad_estado"("sigla");

-- AddForeignKey
ALTER TABLE "cad_publicidade_estado" ADD CONSTRAINT "cad_publicidade_estado_id_publicidade_fkey" FOREIGN KEY ("id_publicidade") REFERENCES "cad_publicidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cad_publicidade_estado" ADD CONSTRAINT "cad_publicidade_estado_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "cad_estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
