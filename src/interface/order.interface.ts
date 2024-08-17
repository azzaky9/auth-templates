import * as v from "valibot";
import {
  CreateOrderSchema,
  deleteOrderSchema,
  PaginateIndexSchema,
  UpdateOrderSchema
} from "@validation/order.validation";

type CreateOrderInputDto = v.InferInput<typeof CreateOrderSchema>;
type GetPaginateOrderParams = v.InferInput<typeof PaginateIndexSchema>;
type DeleteOrderParams = v.InferInput<typeof deleteOrderSchema>;
type UpdateOrderInputDto = v.InferInput<typeof UpdateOrderSchema>;

type TProductOrder = CreateOrderInputDto["products"][0] & { id?: string };

export type {
  CreateOrderInputDto,
  GetPaginateOrderParams,
  DeleteOrderParams,
  UpdateOrderInputDto,
  TProductOrder
};
