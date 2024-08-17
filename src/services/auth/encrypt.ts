import bcrypt from "bcrypt";

const encryptPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

export { encryptPassword };
