/*
  Warnings:

  - You are about to drop the column `businessId` on the `Business` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[businessUniqId]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `businessUniqId` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Business_businessId_key";

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "businessId",
ADD COLUMN     "businessUniqId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Business_businessUniqId_key" ON "Business"("businessUniqId");
