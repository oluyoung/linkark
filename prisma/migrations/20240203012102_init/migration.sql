-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LinkToList" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_editor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_subscriber" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "Link_hostname_origin_idx" ON "Link"("hostname", "origin");

-- CreateIndex
CREATE UNIQUE INDEX "Link_origin_path_query_key" ON "Link"("origin", "path", "query");

-- CreateIndex
CREATE UNIQUE INDEX "_LinkToList_AB_unique" ON "_LinkToList"("A", "B");

-- CreateIndex
CREATE INDEX "_LinkToList_B_index" ON "_LinkToList"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_editor_AB_unique" ON "_editor"("A", "B");

-- CreateIndex
CREATE INDEX "_editor_B_index" ON "_editor"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_subscriber_AB_unique" ON "_subscriber"("A", "B");

-- CreateIndex
CREATE INDEX "_subscriber_B_index" ON "_subscriber"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinkToList" ADD CONSTRAINT "_LinkToList_A_fkey" FOREIGN KEY ("A") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinkToList" ADD CONSTRAINT "_LinkToList_B_fkey" FOREIGN KEY ("B") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_editor" ADD CONSTRAINT "_editor_A_fkey" FOREIGN KEY ("A") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_editor" ADD CONSTRAINT "_editor_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_subscriber" ADD CONSTRAINT "_subscriber_A_fkey" FOREIGN KEY ("A") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_subscriber" ADD CONSTRAINT "_subscriber_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
