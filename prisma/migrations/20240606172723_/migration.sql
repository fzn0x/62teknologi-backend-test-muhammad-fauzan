/*
  Warnings:

  - You are about to drop the column `businessId` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_businessId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "businessId";

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "timeCreated" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "userProfileUrl" TEXT NOT NULL,
    "userImageUrl" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "businessId" BIGINT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BusinessToCategory" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BusinessToCategory_AB_unique" ON "_BusinessToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_BusinessToCategory_B_index" ON "_BusinessToCategory"("B");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessToCategory" ADD CONSTRAINT "_BusinessToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessToCategory" ADD CONSTRAINT "_BusinessToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
