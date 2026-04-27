-- CreateTable
CREATE TABLE "ginivo_account" (
    "account_id" VARCHAR(36) NOT NULL,
    "company_id" VARCHAR(36) NOT NULL,
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
    "last_accessed_company_id" VARCHAR(36) NOT NULL,

    CONSTRAINT "ginivo_account_pkey" PRIMARY KEY ("account_id")
);

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
CREATE TABLE "gini_app" (
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

    CONSTRAINT "gini_app_pkey" PRIMARY KEY ("app_id")
);

-- CreateIndex
CREATE INDEX "idx_account_on_company_id" ON "ginivo_account"("company_id");

-- CreateIndex
CREATE INDEX "idx_account_on_user_id" ON "ginivo_account"("user_id");

-- AddForeignKey
ALTER TABLE "ginivo_account" ADD CONSTRAINT "ginivo_account_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "ginivo_company"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;
