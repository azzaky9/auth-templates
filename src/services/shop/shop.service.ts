import prisma from "@connection/db";
import type { CreateShopDto } from "@interface/shop.interface";

const createShop = async (userId: string, data: CreateShopDto) => {
  await prisma.shop.create({
    data: {
      ...data,
      userId
    }
  });
};

const getShop = async (limit?: number) => {
  return await prisma.shop.findMany({
    take: limit
  });
};

export { createShop, getShop };
