/*
  Warnings:

  - You are about to drop the `ListEditors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ListLinks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ListSubscribers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,creatorId,isPublic]` on the table `List` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `ListEditors` DROP FOREIGN KEY `ListEditors_editorId_fkey`;

-- DropForeignKey
ALTER TABLE `ListEditors` DROP FOREIGN KEY `ListEditors_listId_fkey`;

-- DropForeignKey
ALTER TABLE `ListLinks` DROP FOREIGN KEY `ListLinks_linkId_fkey`;

-- DropForeignKey
ALTER TABLE `ListLinks` DROP FOREIGN KEY `ListLinks_listId_fkey`;

-- DropForeignKey
ALTER TABLE `ListSubscribers` DROP FOREIGN KEY `ListSubscribers_listId_fkey`;

-- DropForeignKey
ALTER TABLE `ListSubscribers` DROP FOREIGN KEY `ListSubscribers_subscriberId_fkey`;

-- DropIndex
DROP INDEX `List_name_creatorId_key` ON `List`;

-- DropTable
DROP TABLE `ListEditors`;

-- DropTable
DROP TABLE `ListLinks`;

-- DropTable
DROP TABLE `ListSubscribers`;

-- CreateTable
CREATE TABLE `ListLink` (
    `id` VARCHAR(191) NOT NULL,
    `linkId` VARCHAR(191) NOT NULL,
    `listId` VARCHAR(191) NOT NULL,

    INDEX `ListLink_linkId_listId_idx`(`linkId`, `listId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ListEditor` (
    `id` VARCHAR(191) NOT NULL,
    `editorId` VARCHAR(191) NOT NULL,
    `listId` VARCHAR(191) NOT NULL,

    INDEX `ListEditor_editorId_listId_idx`(`editorId`, `listId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ListSubscriber` (
    `id` VARCHAR(191) NOT NULL,
    `subscriberId` VARCHAR(191) NOT NULL,
    `listId` VARCHAR(191) NOT NULL,

    INDEX `ListSubscriber_subscriberId_listId_idx`(`subscriberId`, `listId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `List_name_creatorId_isPublic_key` ON `List`(`name`, `creatorId`, `isPublic`);

-- AddForeignKey
ALTER TABLE `ListLink` ADD CONSTRAINT `ListLink_linkId_fkey` FOREIGN KEY (`linkId`) REFERENCES `Link`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListLink` ADD CONSTRAINT `ListLink_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListEditor` ADD CONSTRAINT `ListEditor_editorId_fkey` FOREIGN KEY (`editorId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListEditor` ADD CONSTRAINT `ListEditor_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListSubscriber` ADD CONSTRAINT `ListSubscriber_subscriberId_fkey` FOREIGN KEY (`subscriberId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListSubscriber` ADD CONSTRAINT `ListSubscriber_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
