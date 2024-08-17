import prisma from "@connection/db";
import type {
  CreateOrderInputDto,
  DeleteOrderParams,
  TProductOrder,
  UpdateOrderInputDto
} from "@interface/order.interface";
import { startOfDay, endOfDay } from "date-fns";

const sumSubtotal = (products: TProductOrder[]) => {
  return products.reduce((acc, product) => {
    return acc + product.price * product.quantity;
  }, 0);
};

const getOrderById = async (id: string) => {
  return await prisma.order.findUnique({
    where: {
      id: id
    },
    include: {
      customer: true,
      productOrder: {
        include: {
          product: true
        }
      },
      updatedBy: {
        select: {
          email: true,
          username: true
        }
      },
      shop: {
        select: {
          name: true
        }
      }
    }
  });
};

const createOrder = async (userId: string, data: CreateOrderInputDto) => {
  const subTotal = sumSubtotal(data.products);
  const total = subTotal;
  const prevOrderTotal = await prisma.order.count();

  const customer = await prisma.customer.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: "",
      updatedById: userId
    }
  });
  const [_, dbProducts] = await prisma.$transaction([
    prisma.product.createMany({
      data: data.products.map((product) => {
        return {
          name: product.name,
          price: product.price,
          orderQuantity: product.quantity,
          updatedById: userId
        };
      })
    }),
    prisma.product.findMany()
  ]);
  await prisma.order.create({
    data: {
      shopId: Number(data.shopId),
      subTotal: subTotal,
      total: total,
      customerId: customer.id,
      productOrder: {
        create: dbProducts.map(({ id }) => {
          return {
            productId: id,
            quantity: 1
          };
        })
      },
      invoice: {
        create: {
          total: total,
          id: (prevOrderTotal + 1).toString().padStart(6, "0")
        }
      },
      updatedById: userId,
      paymentType: data.paymentType
    }
  });
};

const getOrders = async () => {
  return await prisma.order.findMany({
    include: {
      shop: {
        select: {
          name: true
        }
      },
      updatedBy: {
        select: {
          email: true,
          username: true
        }
      },
      productOrder: {
        include: {
          product: true
        }
      },
      customer: true
    }
  });
};

const queryOrder = async (customerName: string, date: Date | null) => {
  console.log("🚀 ~ queryOrder ~ date:", date)
  return await prisma.order.findMany({
    where: {
      customer: {
        name: {
          startsWith: customerName,
          mode: "insensitive"
        }
      },
      createdAt: !!date
        ? {
            gte: startOfDay(date),
            lte: endOfDay(date)
          }
        : undefined
    },
    include: {
      updatedBy: {
        select: {
          email: true,
          username: true
        }
      },
      shop: {
        select: {
          name: true
        }
      },
      productOrder: {
        include: {
          product: true
        }
      },
      customer: true
    },
    orderBy: {
      customer: {
        name: "asc"
      }
    }
  });
};

const getPaginatedOrders = async (index: number, shopName?: string) => {
  const take = 10;
  const skip = index * take;

  const data = await prisma.order.findMany({
    where: {
      shop: {
        name: shopName
      }
    },
    include: {
      updatedBy: {
        select: {
          email: true,
          username: true
        }
      },
      shop: {
        select: {
          name: true
        }
      },
      productOrder: {
        include: {
          product: true
        }
      },
      customer: true
    },
    orderBy: {
      customer: {
        name: "asc"
      }
    },
    skip,
    take
  });

  const totalData = await prisma.order.count({
    where: {
      shop: {
        name: shopName
      }
    }
  });

  const curr = index;
  const totalPage = Math.ceil(totalData / take);
  // console.log("🚀 ~ getPaginatedOrders ~ totalPage:", totalPage)

  return {
    data: data,
    meta: {
      prevIndex: curr === 0 || curr > totalPage ? null : curr - 1,
      nextIndex: curr + 1 >= totalPage ? null : curr + 1,
      currentIndex: curr,
      currentPage: curr + 1,
      totalPage: totalPage
    }
  };
};

const getPaginatedOrdersByShopName = async (
  index: number,
  shopName: string
) => {
  return await getPaginatedOrders(index, shopName);
};

const deleteOrderById = async (id: DeleteOrderParams) => {
  return await prisma.order.delete({
    where: {
      id: id
    }
  });
};

const updateOrderById = async (
  id: string,
  data: UpdateOrderInputDto,
  userId: string
) => {
  const updatedSubtotal = sumSubtotal([...data.create, ...data.update]);

  const order = await prisma.order.update({
    where: {
      id: id
    },
    data: {
      customer: {
        update: data.customer
      },
      subTotal: updatedSubtotal,
      total: updatedSubtotal,
      // updatedById: {
      //   set: userId
      // },
      productOrder: {
        update: data.update.map((product) => {
          const { id, ...rest } = product;
          return {
            where: {
              id: Number(id)
            },
            data: {
              product: {
                update: {
                  name: rest.name,
                  price: rest.price,
                  orderQuantity: rest.quantity,
                  updatedById: userId
                }
              }
            }
          };
        })
      }
    },
    select: {
      id: true
    }
  });
  const products = await Promise.all(
    data.create.map(async (product) => {
      return await prisma.product.create({
        data: {
          name: product.name,
          price: product.price,
          orderQuantity: product.quantity,
          updatedById: userId
        }
      });
    })
  );

  await prisma.productOrder.createMany({
    data: products.map((product) => {
      return {
        quantity: product.orderQuantity,
        productId: product.id,
        orderId: order.id
      };
    })
  });
  await prisma.productOrder.deleteMany({
    where: {
      id: {
        in: data.delete.map((id) => Number(id))
      }
    }
  });
};

export {
  createOrder,
  getOrders,
  getPaginatedOrders,
  deleteOrderById,
  getPaginatedOrdersByShopName,
  updateOrderById,
  getOrderById,
  queryOrder
};
