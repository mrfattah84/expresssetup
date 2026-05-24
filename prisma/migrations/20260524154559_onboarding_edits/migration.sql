/*
  Warnings:

  - You are about to drop the column `BD` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `BD` on the `TeacherProfile` table. All the data in the column will be lost.
  - Added the required column `birthDay` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthDay` to the `TeacherProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "BD",
ADD COLUMN     "birthDay" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TeacherProfile" DROP COLUMN "BD",
ADD COLUMN     "birthDay" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL;
