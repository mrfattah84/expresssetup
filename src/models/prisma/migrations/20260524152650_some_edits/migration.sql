/*
  Warnings:

  - You are about to drop the column `age` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `targetAgeGroup` on the `StudentProfile` table. All the data in the column will be lost.
  - Added the required column `BD` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `BD` to the `TeacherProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `canceled` to the `TeacherProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stars` to the `TeacherProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "age",
DROP COLUMN "targetAgeGroup",
ADD COLUMN     "BD" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TeacherProfile" ADD COLUMN     "BD" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "canceled" INTEGER NOT NULL,
ADD COLUMN     "f" DOUBLE PRECISION NOT NULL DEFAULT -1,
ADD COLUMN     "levels" "GermanLevel"[],
ADD COLUMN     "stars" DOUBLE PRECISION NOT NULL;
