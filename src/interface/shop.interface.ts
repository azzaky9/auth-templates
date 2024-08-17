import * as v from "valibot";
import {
  CreateShopSchema,
  GetShopSchemaQuery
} from "@validation/shop.validation";

type CreateShopDto = v.InferInput<typeof CreateShopSchema>;
type GetShopQuery = v.InferInput<typeof GetShopSchemaQuery>;

export type { CreateShopDto, GetShopQuery };
