const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcrypt");
require("dotenv").config();

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "lincolnmeira89@gmail.com";
  const plainPassword = "TROQUE_PARA_UMA_SENHA_forte";

  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash },
  });

  console.log("Admin pronta:", admin.email);

  const initialCommissionTypes = [
    {
      name: "Full Body",
      priceMin: "65.00",
      priceMax: "65.00",
      rules: "Base price: $65. The previous menu shows +$30 per character; confirm the final additional-character pricing with the artist.",
    },
    {
      name: "Bust-up",
      priceMin: "30.00",
      priceMax: "30.00",
      rules: "Base price: $30. The previous menu shows +$15 per character; confirm the final additional-character pricing with the artist.",
    },
    {
      name: "Character Design",
      priceMin: "80.00",
      priceMax: "100.00",
      rules: "A character is designed from the references you provide or your written description. Includes full-body front and back views. No shading.",
    },
    {
      name: "Reference Sheet",
      priceMin: "80.00",
      priceMax: "80.00",
      rules: "The previous site lists this service at $80. Contact the artist to confirm the exact views and included details before ordering.",
    },
  ];

  for (const commissionType of initialCommissionTypes) {
    const existing = await prisma.commissionType.findFirst({
      where: { name: commissionType.name },
    });

    if (!existing) {
      await prisma.commissionType.create({ data: commissionType });
      console.log("Tipo de encomenda inicial criado:", commissionType.name);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
