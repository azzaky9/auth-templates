import * as v from "valibot";

const CreateShopSchema = v.object({
  name: v.pipe(
    v.string("Name must be a string"),
    v.nonEmpty("Name is requried"),
    v.trim()
  ),
  address: v.pipe(
    v.string("Address must be a string"),
    v.nonEmpty("Address is requried"),
    v.trim()
  )
});

const GetShopSchemaQuery = v.object({
  limit: v.optional(
    v.pipe(
      v.string("Limit must be a string"),
      v.regex(/^\d+$/, "Limit must be numeric character"),
      v.nonEmpty("Limit is requried")
    )
  )
});

export { CreateShopSchema, GetShopSchemaQuery };
