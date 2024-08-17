import * as v from "valibot";

const LoginSchema = v.object({
  username: v.pipe(
    v.string("Username must be a string"),
    v.nonEmpty("Username must be at least 1 character long"),
    v.trim()
  ),
  password: v.pipe(
    v.string("Password must be a string"),
    v.nonEmpty("Password must be at least 1 character long")
  )
});

export { LoginSchema };
