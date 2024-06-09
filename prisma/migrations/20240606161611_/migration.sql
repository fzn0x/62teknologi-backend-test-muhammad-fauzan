-- CreateTable
CREATE TABLE "Business" (
    "id" BIGSERIAL NOT NULL,
    "businessId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL,
    "url" TEXT NOT NULL,
    "reviewCount" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "price" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "displayPhone" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "address3" TEXT,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "displayAddress" TEXT[],

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" BIGSERIAL NOT NULL,
    "alias" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "businessId" BIGINT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_businessId_key" ON "Business"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "Business_alias_key" ON "Business"("alias");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
