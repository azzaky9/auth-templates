import { PrismaClient } from "@prisma/client";

const dev = process.env.NODE_ENV === "development";

const prisma = new PrismaClient(
  dev
    ? {
        log: ["error", "query"],
        errorFormat: "pretty"
      }
    : undefined
);

export default prisma;
