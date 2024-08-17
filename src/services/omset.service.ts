import prisma from "@connection/db";

const groupByLocationOmset = async () => {
  const result = await prisma.order.groupBy({
    by: ["shopId"],
    _sum: {
      total: true
    }
  });
  const aggregate = await prisma.order.aggregate({
    _sum: {
      total: true
    }
  });
  const results = await Promise.all(
    result.map(async (r) => {
      const namingOrd = await prisma.shop.findUnique({
        where: {
          id: r.shopId
        },
        select: {
          id: true,
          name: true
        }
      });

      return { ...namingOrd, _sum: r._sum };
    })
  );

  return [...results];
};

export { groupByLocationOmset };
