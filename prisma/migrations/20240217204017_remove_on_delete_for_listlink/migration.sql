-- DropForeignKey
ALTER TABLE `ListLink` DROP FOREIGN KEY `ListLink_listId_fkey`;

-- AddForeignKey
ALTER TABLE `ListLink` ADD CONSTRAINT `ListLink_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
