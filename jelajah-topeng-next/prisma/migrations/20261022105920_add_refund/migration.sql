-- CreateTable
CREATE TABLE "Refund" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "requester" TEXT NOT NULL,
    "participants" TEXT NOT NULL DEFAULT '',
    "destination" TEXT NOT NULL,
    "trxCode" TEXT NOT NULL,
    "visitInfo" TEXT NOT NULL DEFAULT '',
    "filedAt" DATETIME NOT NULL,
    "proofAt" DATETIME NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "reasonDetail" TEXT NOT NULL DEFAULT '',
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "rejectReason" TEXT NOT NULL DEFAULT '',
    "adminNote" TEXT NOT NULL DEFAULT '',
    "decidedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Refund_userId_status_idx" ON "Refund"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Refund_userId_code_key" ON "Refund"("userId", "code");
