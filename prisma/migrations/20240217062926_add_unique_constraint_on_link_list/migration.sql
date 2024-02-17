/*
  Warnings:

  - A unique constraint covering the columns `[linkId,listId]` on the table `ListLink` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `ListLink` DROP FOREIGN KEY `ListLink_linkId_fkey`;

-- CreateIndex
CREATE UNIQUE INDEX `ListLink_linkId_listId_key` ON `ListLink`(`linkId`, `listId`);

-- AddForeignKey
ALTER TABLE `ListLink` ADD CONSTRAINT `ListLink_linkId_fkey` FOREIGN KEY (`linkId`) REFERENCES `Link`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
