import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/billing/crypto";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL y ADMIN_PASSWORD deben estar en .env");
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name: "THEPIOLO Admin" },
    create: {
      email,
      passwordHash,
      name: "THEPIOLO Admin",
    },
  });

  console.log(`✅ Admin listo: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
