-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "documento" VARCHAR(10) NOT NULL,
    "nombres" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "celular" VARCHAR(10) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saldos_usuarios" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saldos_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_documento_key" ON "Usuario"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "saldos_usuarios_usuarioId_key" ON "saldos_usuarios"("usuarioId");

-- AddForeignKey
ALTER TABLE "saldos_usuarios" ADD CONSTRAINT "saldos_usuarios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
