-- CreateTable
CREATE TABLE "Compra" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "sesionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Compra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "usuario_compra_idx" ON "Compra"("usuarioId");

-- CreateIndex
CREATE INDEX "sesion_compra_idx" ON "Compra"("sesionId");

-- CreateIndex
CREATE INDEX "usuario_documento_idx" ON "Usuario"("documento");

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_sesionId_fkey" FOREIGN KEY ("sesionId") REFERENCES "Sesion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
