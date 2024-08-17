import * as v from "valibot";

const CreateProductOrderSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty(), v.trim()),
  price: v.pipe(v.number(), v.minValue(100, "Price must be at least 100")),
  quantity: v.pipe(v.number(), v.minValue(1, "Quantity must be at least 1"))
  // orderQuantity: v.pipe(
  //   v.number(),
  //   v.minValue(1, "Order quantity must be at least 1")
  // )
});

const CreateOrderSchema = v.object({
  name: v.pipe(
    v.string("Customer must be a string"),
    v.nonEmpty("Customer must be at least 1 character long"),
    v.trim()
  ),
  email: v.optional(
    v.pipe(
      v.string("Email must be a string"),
      v.email("Email must be a valid email")
    )
  ),
  phone: v.optional(
    v.pipe(
      v.string("Phone must be a string"),
      v.nonEmpty("Phone must be at least 1 character long"),
      v.trim()
    )
  ),
  products: v.pipe(
    v.array(CreateProductOrderSchema),
    v.minLength(1, "Product must have at least 1 item")
  ),
  shopId: v.pipe(
    v.string(),
    v.nonEmpty("Index params must be at least 1 character long"),
    v.regex(/^[0-9]+$/, "Index params must be a contain numeric character"),
    v.trim()
  ),
  paymentType: v.pipe(
    v.string(),
    v.nonEmpty("Payment type must be at least 1 character long"),
    v.minLength(3, "Payment type must be at least 3 character long"),
    v.trim()
  )
});

const QueryOrderSchema = v.object({
  customerName: v.pipe(
    v.string(),
    v.nonEmpty(),
    v.minLength(1, "Query must be at least 3 character long"),
    v.trim()
  )
});

const UpdateCustomerSchema = v.object({
  customer: v.partial(v.omit(CreateOrderSchema, ["shopId", "products"]))
});
const OptionalProductOrderSchema = v.partial(CreateProductOrderSchema);
const UpdateOrderProduct = v.object({
  create: v.array(CreateProductOrderSchema),
  update: v.array(
    v.object({
      ...CreateProductOrderSchema.entries,
      id: v.pipe(
        v.string(),
        v.nonEmpty("Product id must be at least 1 character long"),
        v.trim()
      )
    })
  ),
  delete: v.array(v.string())
});

const UpdateOrderSchema = v.object({
  ...UpdateCustomerSchema.entries,
  ...UpdateOrderProduct.entries
});

const PaginateIndexSchema = v.pipe(
  v.string(),
  v.nonEmpty("Index params must be at least 1 character long"),
  v.regex(/^[0-9]+$/, "Index params must be a contain numeric character"),
  v.trim()
);

const deleteOrderSchema = v.pipe(v.string(), v.nonEmpty(), v.trim());

export {
  CreateOrderSchema,
  PaginateIndexSchema,
  deleteOrderSchema,
  UpdateOrderSchema,
  QueryOrderSchema
};
