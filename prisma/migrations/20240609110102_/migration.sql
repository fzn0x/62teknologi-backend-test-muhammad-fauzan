/*
  Warnings:

  - You are about to drop the column `businessId` on the `Review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[businessUniqId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `businessUniqId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_businessId_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "businessId",
ADD COLUMN     "businessUniqId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Review_businessUniqId_key" ON "Review"("businessUniqId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_businessUniqId_fkey" FOREIGN KEY ("businessUniqId") REFERENCES "Business"("businessUniqId") ON DELETE RESTRICT ON UPDATE CASCADE;
