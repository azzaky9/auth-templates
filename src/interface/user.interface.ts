import * as v from "valibot";
import {
  CreateUserSchema,
  UpdateUserSchema
} from "@validation/user.validation";

type CreateUserInputDto = v.InferInput<typeof CreateUserSchema>;
type UpdateUserInputDto = v.InferInput<typeof UpdateUserSchema>;

export type { CreateUserInputDto, UpdateUserInputDto };
