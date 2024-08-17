import { type User } from "@prisma/client";
import {
  type CreateUserInputDto,
  type UpdateUserInputDto
} from "@interface/user.interface";
import db from "@connection/db";
import { encryptPassword } from "@services/auth/encrypt";

export const createUser = async (data: CreateUserInputDto) => {
  const { locationId, ...rest } = data;
  const hash = encryptPassword(rest.password);
  return db.user.create({
    data: {
      ...rest,
      password: hash,
      userJobLocation: {
        connect: { id: Number(locationId) }
      }
    }
  });
};

export const getUserById = async (id: string): Promise<User | null> => {
  return db.user.findUnique({
    where: { id }
  });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return db.user.findUnique({
    where: { email }
  });
};

export const updateUser = async (
  id: string,
  userData: UpdateUserInputDto
): Promise<User> => {
  if (userData.password) {
    userData.password = encryptPassword(userData.password);
  }
  const { locationId, ...rest } = userData;
  return db.user.update({
    where: { id },
    data: {
      ...rest,
      userJobLocation: locationId
        ? {
            connect: {
              id: Number(locationId)
            }
          }
        : undefined
    }
  });
};

export const getUsers = async (includeShop?: boolean) => {
  const user = await db.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      userJobLocation: includeShop
    }
  });

  return user;
};

export const findUserByUsername = async (
  username: string,
  _password: string
): Promise<User | null> => {
  const user = await db.user.findUnique({
    where: {
      username
    }
  });
  return user;
};

export const getProfile = async (id: string) => {
  const profile = await db.user.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      role: true,
      username: true,
      name: true,
      userJobLocation: true,
      email: true,
      updatedAt: true
    }
  });

  return profile;
};

export const deleteUser = async (id: string) => {
  return db.user.delete({
    where: { id }
  });
};

export const getAllUsers = async (): Promise<User[]> => {
  return db.user.findMany();
};
