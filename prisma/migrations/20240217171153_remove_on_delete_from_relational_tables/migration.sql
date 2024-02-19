-- DropForeignKey
ALTER TABLE `ListEditor` DROP FOREIGN KEY `ListEditor_listId_fkey`;

-- DropForeignKey
ALTER TABLE `ListLink` DROP FOREIGN KEY `ListLink_linkId_fkey`;

-- DropForeignKey
ALTER TABLE `ListSubscriber` DROP FOREIGN KEY `ListSubscriber_listId_fkey`;

-- AddForeignKey
ALTER TABLE `ListLink` ADD CONSTRAINT `ListLink_linkId_fkey` FOREIGN KEY (`linkId`) REFERENCES `Link`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListEditor` ADD CONSTRAINT `ListEditor_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListSubscriber` ADD CONSTRAINT `ListSubscriber_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
