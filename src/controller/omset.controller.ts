import ErrorHandler from "@config/error-handler";
import { groupByLocationOmset } from "@services/omset.service";
import type { Request, Response } from "express";

const getOmsetController = async (req: Request, res: Response) => {
  try {
    const data = await groupByLocationOmset();

    return res.status(201).send({
      code: 200,
      data
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return ErrorHandler.handleException(error, res);
    }
  }
};

export { getOmsetController };
