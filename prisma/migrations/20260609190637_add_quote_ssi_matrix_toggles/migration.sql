-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "includeConcreteSsiMatrix" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "includeTypicalSsiMatrix" BOOLEAN NOT NULL DEFAULT false;
