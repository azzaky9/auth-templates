import type { Request, Response } from "express";
import ErrorHandler from "@config/error-handler";
import {
  CreateOrderSchema,
  deleteOrderSchema,
  PaginateIndexSchema,
  QueryOrderSchema,
  UpdateOrderSchema
} from "@validation/order.validation";
import type { CreateOrderInputDto } from "@interface/order.interface";
import { validateDto } from "@services/validation-handler";
import {
  createOrder,
  deleteOrderById,
  getOrderById,
  getOrders,
  getPaginatedOrders,
  getPaginatedOrdersByShopName,
  updateOrderById,
  queryOrder as searchOrder
} from "@services/order/order.service";
import { decodeToken } from "@services/auth/auth.service";
import type { TAuthPayload } from "@interface/auth.interface";

const createOrderController = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.id;
    const decoded = decodeToken(accessToken) as TAuthPayload;
    const body = req.body as CreateOrderInputDto;
    const validate = validateDto(CreateOrderSchema, body);

    await createOrder(decoded.id, validate);

    return res.status(201).send({
      code: 201,
      message: "Order created successfully"
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return ErrorHandler.handleException(error, res);
    }
  }
};

const getOrdersController = async (req: Request, res: Response) => {
  try {
    const orders = await getOrders();

    return res.status(200).send({
      code: 200,
      data: orders,
      meta: {
        count: orders.length
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return ErrorHandler.handleException(error, res);
    }
  }
};

const getPageOrder = async (req: Request, res: Response) => {
  try {
    const index = req.params.index as string;
    const outputIndex = validateDto(PaginateIndexSchema, index);

    const pagesResult = await getPaginatedOrders(Number(outputIndex));

    return res.status(200).send({
      code: 200,
      ...pagesResult
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return ErrorHandler.handleException(error, res);
    }
  }
};

const deleteOrderController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const output = validateDto(deleteOrderSchema, id);
    await deleteOrderById(output);

    return res.status(204).send({});
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return ErrorHandler.handleException(error, res);
    }
  }
};

const getPagebasedOnShopName = async (req: Request, res: Response) => {
  try {
    const index = req.params.index as string;
    const shopName = req.params.name as string;
    const outputIndex = validateDto(PaginateIndexSchema, index);
    const pagesResult = await getPaginatedOrdersByShopName(
      Number(outputIndex),
      shopName
    );

    return res.status(200).send({
      code: 200,
      ...pagesResult
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return ErrorHandler.handleException(error, res);
    }
  }
};

const updateOrderController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const accessToken = req.cookies.id;
    const decoded = decodeToken(accessToken) as TAuthPayload;
    const body = req.body as CreateOrderInputDto;
    const validate = validateDto(UpdateOrderSchema, body);

    await updateOrderById(id, validate, decoded.id);

    return res.status(204).send({});
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return ErrorHandler.handleException(error, res);
    }
  }
};

const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const order = await getOrderById(id);

    if (!order) {
      throw new ErrorHandler(
        "NotFoundError",
        "Order with provided id not found",
        404
      );
    }

    return res.status(200).send({
      code: 200,
      data: order
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return ErrorHandler.handleException(error, res);
    }
  }
};

const queryOrder = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.params.customerName as string;
    const queryParams = req.query;
    const date = !!queryParams.date
      ? new Date(queryParams.date as string)
      : null;
    const { customerName } = validateDto(QueryOrderSchema, {
      customerName: searchTerm
    });

    const orders = await searchOrder(customerName, date);

    return res.status(200).send({ code: 200, data: orders });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return ErrorHandler.handleException(error, res);
    }
  }
};

export {
  queryOrder,
  createOrderController,
  getOrdersController,
  getPageOrder,
  deleteOrderController,
  getPagebasedOnShopName,
  updateOrderController,
  getOrderByIdController
};
