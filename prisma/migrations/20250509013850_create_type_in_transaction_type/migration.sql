/*
  Warnings:

  - Added the required column `type` to the `TransactionType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TransactionType" ADD COLUMN     "type" TEXT NOT NULL;
