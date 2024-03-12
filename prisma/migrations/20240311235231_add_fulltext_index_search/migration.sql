/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE FULLTEXT INDEX `Link_title_description_ogDescription_ogTitle_rawUrl_idx` ON `Link`(`title`, `description`, `ogDescription`, `ogTitle`, `rawUrl`);

-- CreateIndex
CREATE FULLTEXT INDEX `List_name_description_idx` ON `List`(`name`, `description`);

-- CreateIndex
CREATE UNIQUE INDEX `user_name_key` ON `user`(`name`);
