/*
  Warnings:

  - A unique constraint covering the columns `[origin,path,query]` on the table `Link` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Link_hostname_origin_idx" ON "Link"("hostname", "origin");

-- CreateIndex
CREATE UNIQUE INDEX "Link_origin_path_query_key" ON "Link"("origin", "path", "query");
