import morgan from "morgan";

const logger = morgan(
  process.env.NODE_ENV === "development" ? "tiny" : "combined"
);

export { logger };
