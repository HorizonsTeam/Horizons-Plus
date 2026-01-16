-- CreateEnum
CREATE TYPE "transport_type" AS ENUM ('TRAIN', 'AVION');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "phone" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panier" (
    "panier_id" SERIAL NOT NULL,
    "user_id" TEXT,
    "session_id" TEXT,
    "cree_le" TIMESTAMP(6) NOT NULL,
    "expire_le" TIMESTAMP(6) NOT NULL,
    "statut" VARCHAR(20) NOT NULL,

    CONSTRAINT "panier_pkey" PRIMARY KEY ("panier_id")
);

-- CreateTable
CREATE TABLE "panier_item" (
    "panier_item_id" SERIAL NOT NULL,
    "panier_id" INTEGER NOT NULL,
    "passager_id" INTEGER NOT NULL,
    "depart_heure" TIME(6) NOT NULL,
    "depart_lieu" VARCHAR(255) NOT NULL,
    "arrivee_heure" TIME(6) NOT NULL,
    "arrivee_lieu" VARCHAR(255) NOT NULL,
    "classe" VARCHAR(20) NOT NULL,
    "siege_restant" VARCHAR(10),
    "prix" DECIMAL(10,2) NOT NULL,
    "ajoute_le" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_voyage" DATE,
    "transport_type" "transport_type" NOT NULL DEFAULT 'TRAIN',

    CONSTRAINT "panier_item_pkey" PRIMARY KEY ("panier_item_id")
);

-- CreateTable
CREATE TABLE "passager" (
    "passager_id" SERIAL NOT NULL,
    "nom" VARCHAR NOT NULL,
    "date_naissance" DATE,
    "email" VARCHAR,
    "telephone" VARCHAR(15),
    "panier_id" INTEGER,
    "user_id" TEXT,

    CONSTRAINT "passager_pkey" PRIMARY KEY ("passager_id")
);

-- CreateTable
CREATE TABLE "promo_code" (
    "promo_code_id" VARCHAR(50) NOT NULL,
    "actif" BOOLEAN DEFAULT true,
    "reduction_type" VARCHAR(10) DEFAULT '%',
    "reduction_value" DECIMAL(5,2) NOT NULL,
    "conditions" JSONB DEFAULT '{}',

    CONSTRAINT "promo_code_pkey" PRIMARY KEY ("promo_code_id")
);

-- CreateTable
CREATE TABLE "paiement" (
    "paiement_id" SERIAL NOT NULL,
    "res_id" INTEGER NOT NULL,
    "montant_total" DECIMAL(10,2) NOT NULL,
    "devise" CHAR(3) NOT NULL,
    "moyen_paiement" VARCHAR,
    "statut" VARCHAR,
    "transaction_id" VARCHAR,
    "cree_le" DATE NOT NULL,

    CONSTRAINT "paiement_pkey" PRIMARY KEY ("paiement_id")
);

-- CreateTable
CREATE TABLE "reservation" (
    "reservation_id" SERIAL NOT NULL,
    "ticket_id" VARCHAR(100) NOT NULL,
    "user_id" TEXT NOT NULL,
    "customer_name" VARCHAR(255) NOT NULL,
    "journey" VARCHAR(500) NOT NULL,
    "date" DATE NOT NULL,
    "time" VARCHAR(5) NOT NULL,
    "passengers" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "transport_type" "transport_type" NOT NULL DEFAULT 'TRAIN',
    "status" VARCHAR(20) NOT NULL DEFAULT 'confirmed',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("reservation_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE INDEX "idx_panier_expire_le" ON "panier"("expire_le");

-- CreateIndex
CREATE INDEX "idx_panier_item_panier_id" ON "panier_item"("panier_id");

-- CreateIndex
CREATE UNIQUE INDEX "reservation_ticket_id_key" ON "reservation"("ticket_id");

-- CreateIndex
CREATE INDEX "reservation_user_id_idx" ON "reservation"("user_id");

-- CreateIndex
CREATE INDEX "reservation_ticket_id_idx" ON "reservation"("ticket_id");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panier" ADD CONSTRAINT "panier_user_id_key" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "panier_item" ADD CONSTRAINT "panier_item_panier_fk" FOREIGN KEY ("panier_id") REFERENCES "panier"("panier_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "panier_item" ADD CONSTRAINT "panier_item_passager_id_fkey" FOREIGN KEY ("passager_id") REFERENCES "passager"("passager_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "passager" ADD CONSTRAINT "passager_panier_fk" FOREIGN KEY ("panier_id") REFERENCES "panier"("panier_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
