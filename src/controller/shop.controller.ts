import ErrorHandler from "@config/error-handler";
import { createShop, getShop } from "@services/shop/shop.service";
import { decodeToken } from "@services/auth/auth.service";
import {
  CreateShopSchema,
  GetShopSchemaQuery
} from "@validation/shop.validation";
import { validateDto } from "@services/validation-handler";
import type { Request, Response } from "express";
import type { TAuthPayload } from "@interface/auth.interface";
import type { CreateOrderInputDto } from "@interface/order.interface";

const createShopController = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.id;
    const decoded = decodeToken(accessToken) as TAuthPayload;
    const body = req.body as CreateOrderInputDto;
    const validate = validateDto(CreateShopSchema, body);

    await createShop(decoded.id, validate);

    return res.status(201).send({
      code: 201,
      message: "Shop created successfully"
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return ErrorHandler.handleException(error, res);
    }
  }
};

const getShopController = async (req: Request, res: Response) => {
  try {
    const q = req.query;
    const validate = validateDto(GetShopSchemaQuery, q);

    const results = await getShop(Number(validate.limit));

    return res.status(200).send({
      code: 200,
      data: results
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return ErrorHandler.handleException(error, res);
    }
  }
};

export { createShopController, getShopController };
