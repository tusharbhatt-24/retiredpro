-- CreateEnum
CREATE TYPE "Role" AS ENUM ('company', 'professional', 'admin');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('draft', 'open', 'active', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "AppStatus" AS ENUM ('pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('draft', 'active', 'completed', 'disputed', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'in_escrow', 'released', 'refunded', 'failed');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('virtual', 'in_person');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('requested', 'confirmed', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "role" "Role" DEFAULT 'professional',
    "auth_provider" TEXT NOT NULL DEFAULT 'local',
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "phone_number" TEXT,
    "is_verified_by_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "gst_number" TEXT,
    "cin_number" TEXT,
    "pan_number" TEXT,
    "official_website" TEXT,
    "industry" TEXT,
    "logo_url" TEXT,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professional" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "ex_company_name" TEXT,
    "ex_designation" TEXT,
    "domain" TEXT,
    "years_of_experience" INTEGER,
    "linkedin_url" TEXT,
    "retirement_letter_url" TEXT,
    "pan_card_url" TEXT,
    "photo_id_url" TEXT,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "commission_rate" DECIMAL(65,30) NOT NULL DEFAULT 0.08,
    "speaker_available" BOOLEAN NOT NULL DEFAULT false,
    "speaker_topics" TEXT[],
    "average_rating" DECIMAL(65,30) DEFAULT 0,
    "total_projects_completed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Professional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "domain_required" TEXT,
    "experience_level" TEXT,
    "budget" DECIMAL(65,30),
    "duration_in_days" INTEGER,
    "status" "ProjectStatus" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "professional_id" TEXT NOT NULL,
    "cover_note" TEXT,
    "status" "AppStatus" NOT NULL DEFAULT 'pending',
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "professional_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "agreed_amount" DECIMAL(65,30) NOT NULL,
    "platform_commission" DECIMAL(65,30) NOT NULL,
    "professional_payout" DECIMAL(65,30) NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "status" "ContractStatus" NOT NULL DEFAULT 'draft',
    "signed_at" TIMESTAMP(3),

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "razorpay_order_id" TEXT,
    "razorpay_payment_id" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "paid_at" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventBooking" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "professional_id" TEXT NOT NULL,
    "event_date" TIMESTAMP(3),
    "duration_hours" DECIMAL(65,30),
    "topic" TEXT,
    "event_type" "EventType" NOT NULL DEFAULT 'virtual',
    "agreed_fee" DECIMAL(65,30),
    "platform_commission" DECIMAL(65,30),
    "status" "EventStatus" NOT NULL DEFAULT 'requested',

    CONSTRAINT "EventBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "reviewee_id" TEXT NOT NULL,
    "project_id" TEXT,
    "event_booking_id" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "contract_id" TEXT,
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_user_id_key" ON "Company"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Company_gst_number_key" ON "Company"("gst_number");

-- CreateIndex
CREATE UNIQUE INDEX "Company_cin_number_key" ON "Company"("cin_number");

-- CreateIndex
CREATE UNIQUE INDEX "Professional_user_id_key" ON "Professional"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Application_project_id_professional_id_key" ON "Application"("project_id", "professional_id");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventBooking" ADD CONSTRAINT "EventBooking_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventBooking" ADD CONSTRAINT "EventBooking_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewee_id_fkey" FOREIGN KEY ("reviewee_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_event_booking_id_fkey" FOREIGN KEY ("event_booking_id") REFERENCES "EventBooking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;
