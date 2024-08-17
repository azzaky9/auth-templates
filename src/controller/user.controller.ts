import * as v from "valibot";
import type { Request, Response } from "express";
import ErrorHandler from "@config/error-handler";
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getProfile
} from "@services/user/user";
import {
  CreateUserSchema,
  UpdateUserSchema
} from "@validation/user.validation";

const createUserController = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const { success, issues, output } = v.safeParse(CreateUserSchema, body);

    if (!success) {
      const message = issues.map((issue) => issue.message).join(", ");
      console.log(message);
      throw new ErrorHandler("ValidationError", message, 400);
    }

    await createUser(output);

    return res.status(201).json({
      code: 201,
      message: "User created successfully"
    });
  } catch (error) {
    if (error instanceof Error) return ErrorHandler.handleException(error, res);
  }
};

const updateUserController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const { success, output, issues } = v.safeParse(UpdateUserSchema, {
      ...body
    });

    if (!id) {
      throw new ErrorHandler(
        "ValidationError",
        "to update Id is required",
        400
      );
    }

    if (!success) {
      const message = issues.map((issue) => issue.message).join(", ");
      throw new ErrorHandler(
        "ValidationError",
        `Update failed: ${message}`,
        400
      );
    }

    await updateUser(id, output);

    return res.status(204).send({});
  } catch (error) {
    if (error instanceof Error) return ErrorHandler.handleException(error, res);
  }
};

const deleteUserController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new ErrorHandler(
        "ValidationError",
        "to delete Id is required",
        400
      );
    }

    await deleteUser(id);

    return res.status(204).send({});
  } catch (error) {
    if (error instanceof Error) return ErrorHandler.handleException(error, res);
  }
};

const getUsersController = async (req: Request, res: Response) => {
  try {
    const q = req.query;
    const users = await getUsers(!!q["include-job"]);

    return res.json({ data: users, code: 200, meta: {} });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return ErrorHandler.handleException(error, res);
    }
  }
};

const getUserProfileController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const profile = await getProfile(userId);

    return res.json({ data: profile, code: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return ErrorHandler.handleException(error, res);
    }
  }
};

export {
  createUserController,
  updateUserController,
  deleteUserController,
  getUsersController,
  getUserProfileController
};
