/*
  Warnings:

  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "KeepType" AS ENUM ('TEXT', 'RICH_TEXT', 'IMAGE', 'VIDEO', 'FILE');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE', 'LOCKED');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "name",
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "username" TEXT;

-- CreateTable
CREATE TABLE "collection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT,

    CONSTRAINT "collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collection_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keep" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "KeepType" NOT NULL DEFAULT 'TEXT',
    "content" TEXT,
    "fileUrl" TEXT,
    "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "collectionId" TEXT,
    "categoryId" TEXT,

    CONSTRAINT "keep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keep_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "keep_category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "collection_userId_idx" ON "collection"("userId");

-- CreateIndex
CREATE INDEX "collection_categoryId_idx" ON "collection"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "collection_category_name_key" ON "collection_category"("name");

-- CreateIndex
CREATE INDEX "keep_userId_idx" ON "keep"("userId");

-- CreateIndex
CREATE INDEX "keep_collectionId_idx" ON "keep"("collectionId");

-- CreateIndex
CREATE INDEX "keep_categoryId_idx" ON "keep"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "keep_category_name_key" ON "keep_category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- AddForeignKey
ALTER TABLE "collection" ADD CONSTRAINT "collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection" ADD CONSTRAINT "collection_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "collection_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keep" ADD CONSTRAINT "keep_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keep" ADD CONSTRAINT "keep_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keep" ADD CONSTRAINT "keep_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "keep_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
