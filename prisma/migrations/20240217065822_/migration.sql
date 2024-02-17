/*
  Warnings:

  - A unique constraint covering the columns `[editorId,listId]` on the table `ListEditor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subscriberId,listId]` on the table `ListSubscriber` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `ListLink` DROP FOREIGN KEY `ListLink_listId_fkey`;

-- CreateIndex
CREATE UNIQUE INDEX `ListEditor_editorId_listId_key` ON `ListEditor`(`editorId`, `listId`);

-- CreateIndex
CREATE UNIQUE INDEX `ListSubscriber_subscriberId_listId_key` ON `ListSubscriber`(`subscriberId`, `listId`);

-- AddForeignKey
ALTER TABLE `ListLink` ADD CONSTRAINT `ListLink_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
