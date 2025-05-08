/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,categoryId,userId]` on the table `Subcategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,userId]` on the table `TransactionType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Category_name_userId_key" ON "Category"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subcategory_name_categoryId_userId_key" ON "Subcategory"("name", "categoryId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionType_name_userId_key" ON "TransactionType"("name", "userId");
