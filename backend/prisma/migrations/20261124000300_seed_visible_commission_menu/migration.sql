INSERT INTO "CommissionType" ("id", "name", "priceMin", "priceMax", "rules", "active")
SELECT 'ad7b4517-c460-4e53-9aae-995a0d31e6b1', 'Full Body', 65.00, 65.00,
       'Base price: $65. The previous menu shows +$30 per character; confirm the final additional-character pricing with the artist.', true
WHERE NOT EXISTS (SELECT 1 FROM "CommissionType" WHERE "name" = 'Full Body');

INSERT INTO "CommissionType" ("id", "name", "priceMin", "priceMax", "rules", "active")
SELECT 'f1be8d41-20f8-4170-974a-c28f15161036', 'Bust-up', 30.00, 30.00,
       'Base price: $30. The previous menu shows +$15 per character; confirm the final additional-character pricing with the artist.', true
WHERE NOT EXISTS (SELECT 1 FROM "CommissionType" WHERE "name" = 'Bust-up');

INSERT INTO "CommissionType" ("id", "name", "priceMin", "priceMax", "rules", "active")
SELECT '0ed99e11-8b36-4852-87a3-30e069209c28', 'Character Design', 80.00, 100.00,
       'A character is designed from the references you provide or your written description. Includes full-body front and back views. No shading.', true
WHERE NOT EXISTS (SELECT 1 FROM "CommissionType" WHERE "name" = 'Character Design');

INSERT INTO "CommissionType" ("id", "name", "priceMin", "priceMax", "rules", "active")
SELECT '5d63f395-cb86-4c0f-85b3-ea9a30f44804', 'Reference Sheet', 80.00, 80.00,
       'The previous site lists this service at $80. Contact the artist to confirm the exact views and included details before ordering.', true
WHERE NOT EXISTS (SELECT 1 FROM "CommissionType" WHERE "name" = 'Reference Sheet');
