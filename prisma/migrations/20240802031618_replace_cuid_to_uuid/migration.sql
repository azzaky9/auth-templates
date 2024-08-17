/*
  Warnings:

  - The primary key for the `invoices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `invoices` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `orderQunatity` on the `products` table. All the data in the column will be lost.
  - Added the required column `orderQuantity` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "invoices_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "products" DROP COLUMN "orderQunatity",
ADD COLUMN     "orderQuantity" INTEGER NOT NULL;
