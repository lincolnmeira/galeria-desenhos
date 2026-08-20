-- CreateEnum
CREATE TYPE "DrawingStatus" AS ENUM ('disponivel', 'pendente', 'reservado', 'vendido');

-- CreateEnum
CREATE TYPE "CommissionOrderStatus" AS ENUM ('na_fila', 'em_progresso', 'concluido');

-- CreateTable
CREATE TABLE "Drawing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "status" "DrawingStatus" NOT NULL DEFAULT 'disponivel',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Drawing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommissionType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priceMin" DECIMAL(65,30) NOT NULL,
    "priceMax" DECIMAL(65,30) NOT NULL,
    "rules" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CommissionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommissionOrder" (
    "id" TEXT NOT NULL,
    "commissionTypeId" TEXT NOT NULL,
    "buyerName" TEXT NOT NULL,
    "buyerContact" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "status" "CommissionOrderStatus" NOT NULL DEFAULT 'na_fila',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommissionOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "CommissionOrder" ADD CONSTRAINT "CommissionOrder_commissionTypeId_fkey" FOREIGN KEY ("commissionTypeId") REFERENCES "CommissionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
