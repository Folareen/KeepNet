/*
  Warnings:

  - You are about to drop the column `categoryId` on the `collection` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `keep` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `collection_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `keep_category` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `username` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "collection" DROP CONSTRAINT "collection_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "keep" DROP CONSTRAINT "keep_categoryId_fkey";

-- DropIndex
DROP INDEX "collection_categoryId_idx";

-- DropIndex
DROP INDEX "keep_categoryId_idx";

-- AlterTable
ALTER TABLE "collection" DROP COLUMN "categoryId",
ADD COLUMN     "isPinned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "keep" DROP COLUMN "categoryId",
ADD COLUMN     "isPinned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "image",
ADD COLUMN     "profilePicture" TEXT,
ALTER COLUMN "username" SET NOT NULL;

-- DropTable
DROP TABLE "collection_category";

-- DropTable
DROP TABLE "keep_category";
