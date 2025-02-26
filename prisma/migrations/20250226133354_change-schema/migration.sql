/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_userId_fkey`;

-- DropTable
DROP TABLE `Task`;

-- CreateTable
CREATE TABLE `MainTask` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` ENUM('Pending', 'In_Progress', 'Completed') NOT NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `priority` ENUM('Low', 'Medium', 'High') NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChildTask` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` ENUM('Pending', 'In_Progress', 'Completed') NOT NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `priority` ENUM('Low', 'Medium', 'High') NOT NULL,
    `mainTaskId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MainTask` ADD CONSTRAINT `MainTask_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChildTask` ADD CONSTRAINT `ChildTask_mainTaskId_fkey` FOREIGN KEY (`mainTaskId`) REFERENCES `MainTask`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
