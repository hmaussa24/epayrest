-- CreateTable
CREATE TABLE "Sesion" (
    "id" SERIAL NOT NULL,
    "token" VARCHAR(6) NOT NULL,
    "sesionId" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sesion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sesion_sesionId_key" ON "Sesion"("sesionId");

-- CreateIndex
CREATE INDEX "sesion_id_idx" ON "Sesion"("sesionId");

-- AddForeignKey
ALTER TABLE "Sesion" ADD CONSTRAINT "Sesion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
