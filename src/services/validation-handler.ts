import * as v from "valibot";
import ErrorHandler from "@config/error-handler";

function validateDto<
  TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
>(
  schema: TSchema,
  input: unknown,
  config?: v.Config<v.InferIssue<TSchema>>
): v.InferOutput<TSchema> {
  const { success, issues, output } = v.safeParse(schema, input, config);
  if (!success) {
    const message = issues.map((issue) => issue.message).join(", ");
    throw new ErrorHandler("ValidationError", message, 400);
  }
  return output;
}

export { validateDto };
