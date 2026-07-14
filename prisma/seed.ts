import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("Admin@12345", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@fixitnow.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@fixitnow.com",
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log("✅ Admin seeded:", admin.email);

  // Seed default categories
  const categories = [
    {
      name: "Plumbing",
      description: "Water pipe, leak, and drain services",
      icon: "🔧",
    },
    {
      name: "Electrical",
      description: "Wiring, lighting, and electrical repairs",
      icon: "⚡",
    },
    {
      name: "Cleaning",
      description: "Home and office deep cleaning services",
      icon: "🧹",
    },
    {
      name: "Painting",
      description: "Interior and exterior painting",
      icon: "🎨",
    },
    {
      name: "Carpentry",
      description: "Furniture, doors, and wood repairs",
      icon: "🪚",
    },
    {
      name: "AC Repair",
      description: "Air conditioning installation and repair",
      icon: "❄️",
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  console.log("✅ Default categories seeded.");
  console.log("\n=============================");
  console.log("  ADMIN CREDENTIALS");
  console.log("=============================");
  console.log("  Email   : admin@fixitnow.com");
  console.log("  Password: Admin@12345");
  console.log("=============================\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
