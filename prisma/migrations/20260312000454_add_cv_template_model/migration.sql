-- CreateTable
CREATE TABLE "cv_template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "requiresPhoto" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_template_pkey" PRIMARY KEY ("id")
);

-- Seed: insertar plantillas ANTES de agregar el FK (CVs existentes tienen templateId="harvard")
INSERT INTO "cv_template" ("id", "name", "description", "category", "isPremium", "requiresPhoto", "isActive", "displayOrder", "createdAt", "updatedAt") VALUES
('harvard',   'Harvard',   'Formato clásico y profesional',       'professional', false, false, true, 0, NOW(), NOW()),
('europass',  'Europass',  'Formato europeo estándar (Europass)',  'european',     false, true,  true, 1, NOW(), NOW()),
('stem',      'STEM',      'Formato técnico para carreras STEM',   'academic',     false, false, true, 2, NOW(), NOW()),
('fullbright','Fulbright', 'Formato para becas Fulbright',         'academic',     false, false, true, 3, NOW(), NOW());

-- AddForeignKey
ALTER TABLE "cv" ADD CONSTRAINT "cv_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "cv_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
