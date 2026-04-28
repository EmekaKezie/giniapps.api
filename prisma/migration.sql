-- CreateTable
CREATE TABLE "ginivo_company" (
    "company_id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(250),
    "phone" VARCHAR(20),
    "address" TEXT,
    "country" VARCHAR(100),
    "website" VARCHAR(100),
    "tax_no" VARCHAR(20),
    "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creator_user_id" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMP(6) NOT NULL,
    "modifier_user_id" VARCHAR(36) NOT NULL,
    "country_code" VARCHAR(10),

    CONSTRAINT "ginivo_company_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "giniapp" (
    "app_id" VARCHAR(36) NOT NULL,
    "app_name" VARCHAR(100) NOT NULL,
    "app_code" VARCHAR(20) NOT NULL,
    "api_key" VARCHAR(50),
    "is_active" INTEGER NOT NULL,
    "is_live" INTEGER NOT NULL,
    "created_date" TIMESTAMPTZ(6),
    "create_by" VARCHAR(36),
    "license_private_key" TEXT,
    "license_public_key" TEXT,
    "generated_license" TEXT,

    CONSTRAINT "giniapp_pkey" PRIMARY KEY ("app_id")
);

-- CreateTable
CREATE TABLE "giniapp_account" (
    "account_id" VARCHAR(36) NOT NULL,
    "user_id" VARCHAR(36) NOT NULL,
    "firstname" VARCHAR(50),
    "lastname" VARCHAR(50),
    "email" VARCHAR(250) NOT NULL,
    "phone" VARCHAR(20),
    "account_status" VARCHAR(20) NOT NULL,
    "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creator_user_id" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMP(6) NOT NULL,
    "modifier_user_id" VARCHAR(36) NOT NULL,
    "is_deactivated" INTEGER NOT NULL DEFAULT 0,
    "deactivation_reason" TEXT,

    CONSTRAINT "giniapp_account_pkey" PRIMARY KEY ("account_id")
);

-- CreateIndex
CREATE INDEX "idx_giniapp_account_on_user_id" ON "giniapp_account"("user_id");
