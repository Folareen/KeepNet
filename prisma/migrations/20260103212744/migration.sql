/*
  Warnings:

  - Made the column `collectionId` on table `keep` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `displayUsername` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "keep" DROP CONSTRAINT "keep_collectionId_fkey";

-- AlterTable
ALTER TABLE "keep" ALTER COLUMN "collectionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "username" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "displayUsername" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "keep" ADD CONSTRAINT "keep_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
