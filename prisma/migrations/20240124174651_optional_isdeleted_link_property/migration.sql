-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Link" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hostname" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogType" TEXT,
    "ogUrl" TEXT,
    "query" TEXT,
    "rawUrl" TEXT NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatorId" TEXT NOT NULL,
    CONSTRAINT "Link_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Link" ("createdAt", "creatorId", "description", "hostname", "id", "isDeleted", "ogDescription", "ogTitle", "ogType", "ogUrl", "origin", "path", "query", "rawUrl", "title", "updatedAt") SELECT "createdAt", "creatorId", "description", "hostname", "id", "isDeleted", "ogDescription", "ogTitle", "ogType", "ogUrl", "origin", "path", "query", "rawUrl", "title", "updatedAt" FROM "Link";
DROP TABLE "Link";
ALTER TABLE "new_Link" RENAME TO "Link";
CREATE INDEX "Link_hostname_origin_idx" ON "Link"("hostname", "origin");
CREATE UNIQUE INDEX "Link_origin_path_query_key" ON "Link"("origin", "path", "query");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
