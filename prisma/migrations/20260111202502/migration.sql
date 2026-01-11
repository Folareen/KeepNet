/*
  Warnings:

  - You are about to drop the column `isPinned` on the `collection` table. All the data in the column will be lost.
  - You are about to drop the column `isPinned` on the `keep` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "collection" DROP COLUMN "isPinned";

-- AlterTable
ALTER TABLE "keep" DROP COLUMN "isPinned";
