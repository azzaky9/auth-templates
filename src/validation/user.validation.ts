import * as v from "valibot";

enum Role {
  admin = "admin",
  user = "user"
}

const CreateUserSchema = v.object({
  email: v.optional(v.string("An email must be string")),
  password: v.pipe(
    v.string("A password must be string"),
    v.nonEmpty("A password is required"),
    v.minLength(8, "Password must be at least 8 characters"),
    v.trim()
  ),
  name: v.pipe(
    v.string("A name must be string"),
    v.nonEmpty("A name is required"),
    v.minLength(3, "Name must be at least 3 characters"),
    v.trim()
  ),
  username: v.pipe(
    v.string("A username must be string"),
    v.nonEmpty("A username is required"),
    v.minLength(3, "Username must be at least 3 characters"),
    v.trim()
  ),
  role: v.pipe(
    v.enum(Role, "Role must be either admin or user"),
    v.nonEmpty("Role is required")
  ),
  locationId: v.optional(
    v.pipe(
      v.string("Location ID must be string"),
      v.nonEmpty(),
      v.trim()
    )
  )
});

const UpdateUserSchema = v.partial(CreateUserSchema);

export { CreateUserSchema, UpdateUserSchema };
