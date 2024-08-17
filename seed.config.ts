import { SeedPrisma } from "@snaplet/seed/adapter-prisma";
import { defineConfig } from "@snaplet/seed/config";
import prisma from "./src/connection/db";

export default defineConfig({
  adapter: () => {
    const client = prisma;
    return new SeedPrisma(client);
  },
  select: ["!*_prisma_migrations"]
});
