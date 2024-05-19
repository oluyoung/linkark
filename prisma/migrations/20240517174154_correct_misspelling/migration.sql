-- DropForeignKey
ALTER TABLE `Link` DROP FOREIGN KEY `Link_creatorId_fkey`;

-- DropForeignKey
ALTER TABLE `List` DROP FOREIGN KEY `List_creatorId_fkey`;

-- AddForeignKey
ALTER TABLE `Link` ADD CONSTRAINT `Link_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `List` ADD CONSTRAINT `List_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
