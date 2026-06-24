-- CreateTable
CREATE TABLE "water_changes" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "waterAmount" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "aquarium_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "water_changes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organisms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "purchase_date" TEXT,
    "price" DOUBLE PRECISION,
    "health_status" TEXT,
    "gender" TEXT,
    "length" DOUBLE PRECISION,
    "notes" TEXT,
    "aquarium_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organisms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feeding_records" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "supply_id" INTEGER NOT NULL,
    "notes" TEXT,
    "aquarium_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feeding_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medication_records" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "dosage" DOUBLE PRECISION NOT NULL,
    "date" TEXT NOT NULL,
    "notes" TEXT,
    "aquarium_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medication_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "water_quality_records" (
    "id" SERIAL NOT NULL,
    "test_type" TEXT NOT NULL,
    "test_date" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "aquarium_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "water_quality_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "notes" TEXT,
    "purchase_date" TEXT,
    "expiry_date" TEXT,
    "aquarium_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "notes" TEXT,
    "purchase_date" TEXT,
    "aquarium_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "water_changes" ADD CONSTRAINT "water_changes_aquarium_id_fkey" FOREIGN KEY ("aquarium_id") REFERENCES "aquariums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisms" ADD CONSTRAINT "organisms_aquarium_id_fkey" FOREIGN KEY ("aquarium_id") REFERENCES "aquariums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feeding_records" ADD CONSTRAINT "feeding_records_supply_id_fkey" FOREIGN KEY ("supply_id") REFERENCES "supplies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feeding_records" ADD CONSTRAINT "feeding_records_aquarium_id_fkey" FOREIGN KEY ("aquarium_id") REFERENCES "aquariums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medication_records" ADD CONSTRAINT "medication_records_aquarium_id_fkey" FOREIGN KEY ("aquarium_id") REFERENCES "aquariums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "water_quality_records" ADD CONSTRAINT "water_quality_records_aquarium_id_fkey" FOREIGN KEY ("aquarium_id") REFERENCES "aquariums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplies" ADD CONSTRAINT "supplies_aquarium_id_fkey" FOREIGN KEY ("aquarium_id") REFERENCES "aquariums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_aquarium_id_fkey" FOREIGN KEY ("aquarium_id") REFERENCES "aquariums"("id") ON DELETE SET NULL ON UPDATE CASCADE;
