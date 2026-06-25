-- CreateTable
CREATE TABLE "consultations" (
    "id" TEXT NOT NULL,
    "student_name" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "parent_contact" TEXT NOT NULL,
    "interested_course" TEXT NOT NULL,
    "preferred_date" TIMESTAMP(3) NOT NULL,
    "privacy_consent" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consultations_pkey" PRIMARY KEY ("id")
);
