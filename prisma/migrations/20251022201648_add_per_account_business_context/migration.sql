-- AlterTable
ALTER TABLE "AdAccount" ADD COLUMN "industry" TEXT,
ADD COLUMN "businessModel" TEXT,
ADD COLUMN "primaryGoal" TEXT,
ADD COLUMN "averageOrderValue" DECIMAL(10,2),
ADD COLUMN "profitMargin" DECIMAL(5,2),
ADD COLUMN "hasRepeatPurchases" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "repeatPurchaseFrequency" TEXT,
ADD COLUMN "breakEvenCPA" DECIMAL(10,2),
ADD COLUMN "targetCPA" DECIMAL(10,2),
ADD COLUMN "minimumROAS" DECIMAL(10,2),
ADD COLUMN "targetROAS" DECIMAL(10,2),
ADD COLUMN "ltvMultiplier" DECIMAL(5,2);
