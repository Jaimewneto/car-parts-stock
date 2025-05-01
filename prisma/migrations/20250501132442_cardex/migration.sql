-- CreateTable
CREATE TABLE "Cardex" (
    "id" SERIAL NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "addition" INTEGER NOT NULL DEFAULT 0,
    "withdrawal" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cardex_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cardex" ADD CONSTRAINT "Cardex_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
